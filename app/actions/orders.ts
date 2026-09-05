'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { Order, OrderStatus } from '@/lib/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/lib/supabase/mock-data';
import { sendOrderEmails, sendStatusUpdateEmail } from '@/lib/email/order-emails';
import { revalidatePath } from 'next/cache';

export interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_address: string;
  city: string;
  area_name: string;
  delivery_slot?: string;
  delivery_notes?: string;
}

export interface OrderActionResult {
  success: boolean;
  order?: Order;
  error?: string;
}

// Helper to check if string is a valid PostgreSQL UUID
function isValidUUID(str?: string | null): boolean {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim());
}

// Helper to extract missing column name from PostgREST/Postgres error messages
function extractMissingColumn(errorMessage?: string | null): string | null {
  if (!errorMessage || typeof errorMessage !== 'string') return null;
  const matchPostgrest = errorMessage.match(/Could not find the '([^']+)' column/i);
  if (matchPostgrest && matchPostgrest[1]) return matchPostgrest[1];
  const matchPostgres = errorMessage.match(/column ["']([^"']+)["'](?: of relation)? does not exist/i);
  if (matchPostgres && matchPostgres[1]) return matchPostgres[1];
  return null;
}

export async function submitOrderAction(input: CreateOrderInput): Promise<OrderActionResult> {
  if (!input.items || input.items.length === 0) {
    return { success: false, error: 'Cannot checkout with an empty cart.' };
  }

  if (!input.customer_name?.trim() || !input.customer_phone?.trim() || !input.delivery_address?.trim() || !input.area_name?.trim()) {
    return { success: false, error: 'All required contact and delivery fields must be completed.' };
  }

  try {
    const adminClient = createAdminClient();
    const productIds = input.items.map((i) => i.productId);

    // 1. Fetch real products from DB by ID to strictly prevent client-side price tampering
    let dbProducts: any[] | null = null;
    if (adminClient) {
      try {
        const { data, error } = await adminClient
          .from('products')
          .select('id, name, price, stock, is_active')
          .in('id', productIds);

        if (!error && Array.isArray(data)) {
          dbProducts = data;
        } else if (error) {
          console.warn('[Product Lookup DB Notice]:', error.message);
        }
      } catch (e) {
        console.warn('[Product Lookup Exception]:', e);
      }
    }

    let verifiedProducts: Array<{ id: string; name: string; price: number; stock: number; is_active: boolean }> = [];

    if (dbProducts && dbProducts.length > 0) {
      verifiedProducts = dbProducts;
    } else {
      verifiedProducts = INITIAL_PRODUCTS.filter((p) => productIds.includes(p.id));
    }

    // 2. Validate stock and calculate authoritative subtotal server-side
    let calculatedSubtotal = 0;
    const orderItemsSnapshot: Array<{
      product_id: string;
      product_name: string;
      product_price: number;
      quantity: number;
      subtotal: number;
    }> = [];

    for (const cartItem of input.items) {
      const dbProd = verifiedProducts.find((p) => p.id === cartItem.productId);
      if (!dbProd || !dbProd.is_active) {
        return { success: false, error: `Product "${dbProd?.name || cartItem.productId}" is no longer available.` };
      }

      // Check stock availability
      if (typeof dbProd.stock === 'number' && dbProd.stock < cartItem.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${dbProd.name}". Available: ${dbProd.stock}, requested: ${cartItem.quantity}.`,
        };
      }

      const itemPrice = Number(dbProd.price);
      const itemSubtotal = itemPrice * cartItem.quantity;
      calculatedSubtotal += itemSubtotal;

      orderItemsSnapshot.push({
        product_id: dbProd.id,
        product_name: dbProd.name,
        product_price: itemPrice,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Authoritative server-side delivery fee calculation:
    // Shahzad Town is FREE (0.00); all other areas have a paid delivery fee (Rs. 150 or configured fee)
    const areaLower = input.area_name.toLowerCase();
    const isShahzadTown = areaLower.includes('shahzad town') && !areaLower.includes('chak shahzad');

    let deliveryFee = 0.00;
    if (!isShahzadTown) {
      deliveryFee = 150.00; // standard paid delivery fee for non-Shahzad Town areas
      if (adminClient) {
        try {
          const cleanArea = input.area_name.split('(')[0].split('—')[0].trim();
          const { data: areaRecord } = await adminClient
            .from('delivery_areas')
            .select('delivery_fee')
            .ilike('name', `%${cleanArea}%`)
            .maybeSingle();

          if (areaRecord && typeof areaRecord.delivery_fee === 'number' && areaRecord.delivery_fee > 0) {
            deliveryFee = Number(areaRecord.delivery_fee);
          }
        } catch (e) {
          // ignore and keep standard paid delivery fee
        }
      }
    }

    const totalAmount = calculatedSubtotal + deliveryFee;
    const orderNumber = `FFD-${Math.floor(1000 + Math.random() * 9000)}`;
    let orderId = `ord-${Date.now()}`;

    const deliverySlot = input.delivery_slot === 'Evening' ? 'Evening' : 'Morning';

    // 3. Insert order record into Supabase PostgreSQL
    if (adminClient) {
      const newOrderRecord: Record<string, any> = {
        order_number: orderNumber,
        customer_name: input.customer_name.trim(),
        customer_email: (input.customer_email || '').trim(),
        customer_phone: input.customer_phone.trim(),
        delivery_address: input.delivery_address.trim(),
        city: input.city?.trim() || 'Islamabad',
        area_name: input.area_name.trim(),
        delivery_slot: deliverySlot,
        delivery_notes: (input.delivery_notes || '').trim(),
        delivery_fee: deliveryFee,
        subtotal: calculatedSubtotal,
        total_amount: totalAmount,
        status: 'Pending',
        payment_method: 'Cash on Delivery',
        payment_status: 'Pending',
      };

      let insertedOrder: any = null;
      let orderInsertError: any = null;
      let orderPayload = { ...newOrderRecord };

      // Schema-resilient insertion loop (up to 10 iterations to gracefully omit any missing remote columns)
      for (let attempt = 0; attempt < 10; attempt++) {
        const res = await adminClient
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();

        if (!res.error && res.data) {
          insertedOrder = res.data;
          orderInsertError = null;
          break;
        }

        orderInsertError = res.error;
        const missingCol = extractMissingColumn(res.error?.message);
        if (missingCol && missingCol in orderPayload) {
          console.warn(`[Supabase Schema Notice]: Column '${missingCol}' does not exist on 'orders' table. Omitting and retrying...`);
          delete orderPayload[missingCol];
        } else {
          break;
        }
      }

      if (orderInsertError || !insertedOrder) {
        console.error('[DATABASE ORDER INSERT ERROR]:', orderInsertError);
        return {
          success: false,
          error: `Database order placement failed: ${orderInsertError?.message || 'Could not insert record into orders table.'}`,
        };
      }

      if (insertedOrder) {
        orderId = insertedOrder.id;
        console.log(`[DATABASE SUCCESS] Created order in Supabase with ID: ${orderId} (#${orderNumber})`);

        const itemsToInsert = orderItemsSnapshot.map((it) => ({
          order_id: insertedOrder.id,
          product_id: isValidUUID(it.product_id) ? it.product_id : null,
          product_name: it.product_name,
          product_price: it.product_price,
          quantity: it.quantity,
          subtotal: it.subtotal,
        }));

        let itemsPayload: any[] = [...itemsToInsert];
        let itemsInsertError: any = null;

        for (let attempt = 0; attempt < 10; attempt++) {
          const res = await adminClient
            .from('order_items')
            .insert(itemsPayload);

          if (!res.error) {
            itemsInsertError = null;
            break;
          }

          itemsInsertError = res.error;
          const missingCol = extractMissingColumn(res.error?.message);
          if (missingCol) {
            console.warn(`[Supabase Schema Notice]: Column '${missingCol}' does not exist on 'order_items' table. Omitting and retrying...`);
            itemsPayload = itemsPayload.map((item) => {
              const copy = { ...item };
              delete copy[missingCol];
              return copy;
            });
          } else {
            break;
          }
        }

        if (itemsInsertError) {
          console.error('[DATABASE ORDER ITEMS INSERT ERROR]:', itemsInsertError);
        } else {
          console.log(`[DATABASE SUCCESS] Inserted ${itemsToInsert.length} order items for order ${orderId}`);
        }

        // 3b. Decrement stock for purchased products in database
        for (const item of input.items) {
          if (isValidUUID(item.productId)) {
            const dbProd = verifiedProducts.find((p) => p.id === item.productId);
            if (dbProd && typeof dbProd.stock === 'number') {
              const newStock = Math.max(0, dbProd.stock - item.quantity);
              await adminClient
                .from('products')
                .update({ stock: newStock, updated_at: new Date().toISOString() })
                .eq('id', item.productId);
            }
          }
        }
      }
    } else {
      console.warn('[Supabase Notice]: Database client offline. Order created in memory.');
    }

    const completedOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: input.customer_name.trim(),
      customer_email: (input.customer_email || '').trim(),
      customer_phone: input.customer_phone.trim(),
      delivery_address: input.delivery_address.trim(),
      city: input.city?.trim() || 'Islamabad',
      area_name: input.area_name.trim(),
      delivery_slot: deliverySlot,
      delivery_notes: input.delivery_notes?.trim(),
      delivery_fee: deliveryFee,
      subtotal: calculatedSubtotal,
      total_amount: totalAmount,
      status: 'Pending',
      payment_method: 'Cash on Delivery',
      payment_status: 'Pending',
      items: orderItemsSnapshot,
      created_at: new Date().toISOString(),
    };

    // Revalidate admin orders page safely
    try {
      revalidatePath('/admin/orders');
    } catch (e) {
      // Invariant catch for non-Next.js runtime contexts
    }

    // 4. Trigger server-side transactional email notifications immediately
    console.log(`[EMAIL DISPATCH] Initiating confirmation emails for order #${completedOrder.order_number}...`);
    try {
      const emailResults = await sendOrderEmails({
        order: completedOrder,
        items: orderItemsSnapshot,
      });
      console.log(`[EMAIL DISPATCH COMPLETE] Customer Email Status: ${emailResults.customerResult.success ? 'SUCCESS' : emailResults.customerResult.error || 'SKIPPED'}, Admin Alert Status: ${emailResults.adminResult.success ? 'SUCCESS' : emailResults.adminResult.error || 'FAILED'}`);
    } catch (emailErr) {
      console.error('[Order Email Trigger Handled Error]:', emailErr);
    }

    return {
      success: true,
      order: completedOrder,
    };
  } catch (err: any) {
    console.error('Order creation server error:', err);
    return { success: false, error: err?.message || 'Failed to submit order.' };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const adminClient = createAdminClient();
    const paymentStatus = status === 'Delivered' ? 'Paid' : 'Pending';

    let existingOrder: Order | null = null;

    if (adminClient) {
      // 1. Fetch current order to check previous status and customer email
      const { data: orderData } = await adminClient
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', orderId)
        .maybeSingle();

      if (orderData) {
        existingOrder = orderData as Order;
      }

      // 2. Update status in database
      const { error } = await adminClient
        .from('orders')
        .update({
          status,
          payment_status: paymentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (error) {
        console.error('Order status update error:', error);
        return { success: false, error: error.message };
      }
    }

    try {
      revalidatePath('/admin/orders');
    } catch (e) {}

    // 3. Send lifecycle status notification email if order has valid email
    if (existingOrder && existingOrder.status !== status) {
      try {
        const updatedOrderRecord = { ...existingOrder, status };
        console.log(`[STATUS EMAIL] Sending status update email for order #${existingOrder.order_number} to "${status}"...`);
        const result = await sendStatusUpdateEmail({
          order: updatedOrderRecord,
          newStatus: status,
        });
        console.log(`[STATUS EMAIL RESULT] Result: ${result.success ? 'SUCCESS' : result.error || 'SKIPPED'}`);
      } catch (emailErr) {
        console.error('[Status Email Trigger Error]:', emailErr);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Status update action exception:', err);
    return { success: false, error: err?.message || 'Failed to update order status.' };
  }
}

export async function getOrderByNumberAction(orderNumber: string): Promise<Order | null> {
  if (!orderNumber || typeof orderNumber !== 'string') return null;

  try {
    const adminClient = createAdminClient();
    if (!adminClient) {
      const mockOrder = INITIAL_ORDERS.find((o) => o.order_number.toLowerCase() === orderNumber.trim().toLowerCase());
      return (mockOrder as Order) || null;
    }

    const { data, error } = await adminClient
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', orderNumber.trim())
      .maybeSingle();

    if (error) {
      console.warn('[getOrderByNumber DB Notice]:', error.message);
      const mockOrder = INITIAL_ORDERS.find((o) => o.order_number.toLowerCase() === orderNumber.trim().toLowerCase());
      return (mockOrder as Order) || null;
    }

    return (data as Order) || null;
  } catch (err) {
    console.warn('[getOrderByNumber Exception]:', err);
    return null;
  }
}
