import { Order, OrderItem } from '@/lib/types';
import { renderEmailHeader } from './EmailHeader';
import { renderEmailFooter } from './EmailFooter';
import { escapeHtml, formatCurrency } from './sanitize';

export function generateAdminNewOrderHtml(order: Order, items?: OrderItem[]): string {
  const safeCustomerName = escapeHtml(order.customer_name);
  const safeCustomerEmail = escapeHtml(order.customer_email || 'Not Provided');
  const safeOrderNumber = escapeHtml(order.order_number);
  const safeAddress = escapeHtml(order.delivery_address);
  const safeArea = escapeHtml(order.area_name);
  const safeCity = escapeHtml(order.city || 'Islamabad');
  const safePhone = escapeHtml(order.customer_phone);
  const safeNotes = escapeHtml(order.delivery_notes || 'None');
  const orderDateTime = new Date(order.created_at || Date.now()).toLocaleString('en-PK', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://farm-fresh-dairy-phi.vercel.app').replace(/\/$/, '');
  const adminDashboardUrl = `${appUrl}/admin/orders`;

  const orderItemsList = (items && items.length > 0 ? items : order.items) || [];

  const itemsRows = orderItemsList
    .map((item) => {
      const name = escapeHtml(item.product_name);
      const qty = item.quantity;
      const price = formatCurrency(item.product_price);
      const subtotal = formatCurrency(item.subtotal || item.product_price * qty);

      return `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #EFEFEF; color: #1A2621; font-size: 13px;">
            <strong>${name}</strong>
            <div style="font-size: 11px; color: #7A8B83;">
              ${price} × ${qty}
            </div>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #EFEFEF; text-align: right; font-weight: bold; color: #1B4D3E; font-size: 13px; font-family: monospace;">
            ${subtotal}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>🛒 New Order Received — #${safeOrderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F8F5; font-family: 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F4F8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5ECE8; box-shadow: 0 4px 12px rgba(0,0,0,0.04); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td>
                  ${renderEmailHeader('Admin Dispatch Alert')}
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px 28px;">
                  
                  <!-- Alert Badge -->
                  <div style="margin-bottom: 20px;">
                    <span style="display: inline-block; background-color: #FEF3C7; color: #92400E; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; padding: 4px 10px; border-radius: 20px;">
                      🛒 New Customer Order Placed
                    </span>
                    <h2 style="margin: 8px 0 4px 0; color: #1A2621; font-family: Georgia, serif; font-size: 22px;">
                      Order #${safeOrderNumber}
                    </h2>
                    <p style="margin: 0; color: #61736A; font-size: 13px;">
                      Placed on ${orderDateTime}
                    </p>
                  </div>

                  <!-- Quick Action Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                    <tr>
                      <td align="center" style="background-color: #1B4D3E; border-radius: 12px; padding: 14px 24px;">
                        <a href="${adminDashboardUrl}" target="_blank" style="color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; font-family: 'Helvetica Neue', Arial, sans-serif;">
                          👉 Open Admin Orders Dashboard
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Customer Details Card -->
                  <table width="100%" cellpadding="14" cellspacing="0" border="0" style="background-color: #F8FAF9; border: 1px solid #E5ECE8; border-radius: 12px; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
                    <tr>
                      <td>
                        <strong style="color: #1B4D3E; font-size: 14px; display: block; margin-bottom: 8px; text-transform: uppercase; font-family: monospace;">
                          Customer & Delivery Information
                        </strong>
                        <div style="color: #2C3E35;">
                          <strong>Customer Name:</strong> ${safeCustomerName}<br />
                          <strong>Phone Number:</strong> <a href="tel:${safePhone}" style="color: #1B4D3E; font-weight: bold;">${safePhone}</a><br />
                          <strong>Email:</strong> ${safeCustomerEmail}<br />
                          <strong>Delivery Area:</strong> ${safeArea}, ${safeCity}<br />
                          <strong>Address:</strong> ${safeAddress}<br />
                          <strong>Notes:</strong> <em>${safeNotes}</em>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Summary Table -->
                  <h3 style="margin: 0 0 10px 0; color: #1A2621; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                    Ordered Items (${orderItemsList.length})
                  </h3>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                    ${itemsRows}
                  </table>

                  <!-- Totals Breakdown -->
                  <table width="100%" cellpadding="6" cellspacing="0" border="0" style="margin-bottom: 24px; font-size: 13px;">
                    <tr>
                      <td style="color: #61736A;">Items Subtotal:</td>
                      <td style="text-align: right; font-family: monospace; color: #2C3E35;">
                        ${formatCurrency(order.subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #61736A;">Delivery Fee:</td>
                      <td style="text-align: right; font-family: monospace; color: #2C3E35;">
                        ${order.delivery_fee && order.delivery_fee > 0 ? formatCurrency(order.delivery_fee) : 'Rs. 0 (Free)'}
                      </td>
                    </tr>
                    <tr style="border-top: 2px solid #1B4D3E;">
                      <td style="padding-top: 8px; font-size: 15px; font-weight: bold; color: #1A2621;">
                        Total to Collect (COD):
                      </td>
                      <td style="padding-top: 8px; text-align: right; font-size: 17px; font-weight: bold; color: #1B4D3E; font-family: monospace;">
                        ${formatCurrency(order.total_amount)}
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; color: #7A8B83; font-size: 12px; text-align: center;">
                    Order record was saved in Supabase database. You can manage status and dispatch from the admin panel.
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td>
                  ${renderEmailFooter()}
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
