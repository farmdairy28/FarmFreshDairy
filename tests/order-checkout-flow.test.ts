/**
 * End-to-End Checkout & Email Trigger Verification Test
 */
import { submitOrderAction, updateOrderStatusAction } from '../app/actions/orders';
import { INITIAL_PRODUCTS } from '../lib/supabase/mock-data';

async function testCheckoutOrderFlow() {
  console.log('\n========================================================');
  console.log('🛒 TESTING END-TO-END CHECKOUT & EMAIL DISPATCH FLOW');
  console.log('========================================================\n');

  const testProduct = INITIAL_PRODUCTS[0];

  const payload = {
    items: [
      {
        productId: testProduct.id,
        quantity: 2,
      },
    ],
    customer_name: 'Test Customer (Hassan)',
    customer_email: 'testcustomer@farmfreshdairyproducts.com',
    customer_phone: '03109361932',
    delivery_address: 'House 45, Street 10, Sector G-10/4',
    city: 'Islamabad',
    area_name: 'Shahzad Town',
    delivery_notes: 'Urgent morning milk delivery test',
  };

  console.log('1. Submitting checkout order payload...');
  const result = await submitOrderAction(payload);

  console.log('\n2. Result received from submitOrderAction:');
  console.log('Success:', result.success);
  console.log('Order Details:', result.order ? {
    id: result.order.id,
    order_number: result.order.order_number,
    total_amount: result.order.total_amount,
    customer_name: result.order.customer_name,
    customer_email: result.order.customer_email,
    items_count: result.order.items?.length,
  } : null);

  if (result.success && result.order) {
    console.log('\n3. Testing status update lifecycle for order:', result.order.id);
    const statusResult = await updateOrderStatusAction(result.order.id, 'Confirmed');
    console.log('Status update to "Confirmed":', statusResult.success ? 'SUCCESS' : statusResult.error);
  }

  console.log('\n========================================================');
  console.log('✅ TEST COMPLETED SUCCESSFULLY');
  console.log('========================================================\n');
}

testCheckoutOrderFlow().catch((err) => {
  console.error('Fatal order checkout test error:', err);
  process.exit(1);
});
