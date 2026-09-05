import { Order, OrderItem } from '@/lib/types';
import { renderEmailHeader } from './EmailHeader';
import { renderEmailFooter } from './EmailFooter';
import { escapeHtml, formatCurrency } from './sanitize';

export function generateCustomerOrderConfirmationHtml(order: Order, items?: OrderItem[]): string {
  const safeCustomerName = escapeHtml(order.customer_name);
  const safeOrderNumber = escapeHtml(order.order_number);
  const safeAddress = escapeHtml(order.delivery_address);
  const safeArea = escapeHtml(order.area_name);
  const safeCity = escapeHtml(order.city || 'Islamabad');
  const safePhone = escapeHtml(order.customer_phone);
  const safeNotes = escapeHtml(order.delivery_notes || '');
  const orderDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-PK', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const orderItemsList = (items && items.length > 0 ? items : order.items) || [];

  const itemsRows = orderItemsList
    .map((item) => {
      const name = escapeHtml(item.product_name);
      const qty = item.quantity;
      const price = formatCurrency(item.product_price);
      const subtotal = formatCurrency(item.subtotal || item.product_price * qty);

      return `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #EFEFEF; color: #2C3E35; font-size: 14px;">
            <strong style="color: #1B4D3E;">${name}</strong>
            <div style="font-size: 12px; color: #7A8B83; margin-top: 2px;">
              ${price} × ${qty}
            </div>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #EFEFEF; text-align: right; font-weight: bold; color: #1B4D3E; font-size: 14px; font-family: monospace;">
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
      <title>Thank You for Your Order! — #${safeOrderNumber}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F8F5; font-family: 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F4F8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5ECE8; box-shadow: 0 4px 12px rgba(0,0,0,0.04); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td>
                  ${renderEmailHeader('Order Confirmation')}
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px 28px;">
                  
                  <!-- Greeting & Status Badge -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                    <tr>
                      <td>
                        <span style="display: inline-block; background-color: #E7F3ED; color: #1B4D3E; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px;">
                          ✓ Order Successfully Received
                        </span>
                        <h2 style="margin: 0 0 8px 0; color: #1A2621; font-family: Georgia, serif; font-size: 22px;">
                          Thank You, ${safeCustomerName}!
                        </h2>
                        <p style="margin: 0; color: #4A5B53; font-size: 14px; line-height: 1.6;">
                          We have received your order <strong>#${safeOrderNumber}</strong> and our team is preparing your pure, chilled dairy dispatch.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Meta Box -->
                  <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #F9FBFA; border: 1px solid #E7EFEA; border-radius: 12px; margin-bottom: 24px; font-size: 13px;">
                    <tr>
                      <td style="color: #61736A;">Order Number:</td>
                      <td style="font-family: monospace; font-weight: bold; color: #1B4D3E; text-align: right;">#${safeOrderNumber}</td>
                    </tr>
                    <tr>
                      <td style="color: #61736A;">Order Date:</td>
                      <td style="font-weight: 600; color: #2C3E35; text-align: right;">${orderDate}</td>
                    </tr>
                    <tr>
                      <td style="color: #61736A;">Payment Method:</td>
                      <td style="font-weight: 600; color: #2C3E35; text-align: right;">Cash on Delivery (COD)</td>
                    </tr>
                    <tr>
                      <td style="color: #61736A;">Delivery Slot:</td>
                      <td style="font-weight: 600; color: #1B4D3E; text-align: right;">Morning 6:00 AM – 9:00 AM</td>
                    </tr>
                  </table>

                  <!-- Items Summary Table -->
                  <h3 style="margin: 0 0 12px 0; color: #1A2621; font-size: 15px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Helvetica Neue', Arial, sans-serif;">
                    Purchased Items
                  </h3>

                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                    ${itemsRows}
                  </table>

                  <!-- Totals Breakdown -->
                  <table width="100%" cellpadding="6" cellspacing="0" border="0" style="margin-bottom: 28px; font-size: 14px;">
                    <tr>
                      <td style="color: #61736A;">Subtotal:</td>
                      <td style="text-align: right; font-family: monospace; color: #2C3E35;">
                        ${formatCurrency(order.subtotal)}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #61736A;">Morning Chilled Delivery:</td>
                      <td style="text-align: right; font-family: monospace; color: #1B4D3E; font-weight: bold;">
                        ${order.delivery_fee && order.delivery_fee > 0 ? formatCurrency(order.delivery_fee) : 'FREE'}
                      </td>
                    </tr>
                    <tr style="border-top: 2px solid #1B4D3E;">
                      <td style="padding-top: 10px; font-size: 16px; font-weight: bold; color: #1A2621;">
                        Total Payable:
                      </td>
                      <td style="padding-top: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #1B4D3E; font-family: monospace;">
                        ${formatCurrency(order.total_amount)}
                      </td>
                    </tr>
                  </table>

                  <!-- Delivery Information Box -->
                  <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E5ECE8; border-left: 4px solid #1B4D3E; border-radius: 8px; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
                    <tr>
                      <td>
                        <strong style="color: #1B4D3E; font-size: 14px; display: block; margin-bottom: 6px;">
                          🚚 Delivery Address & Details:
                        </strong>
                        <div style="color: #2C3E35;">
                          <strong>Recipient:</strong> ${safeCustomerName} (${safePhone})<br />
                          <strong>Area:</strong> ${safeArea}, ${safeCity}<br />
                          <strong>Address:</strong> ${safeAddress}
                          ${safeNotes ? `<br /><strong>Delivery Notes:</strong> <em style="color: #8C5310;">"${safeNotes}"</em>` : ''}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; color: #5B6B64; font-size: 13px; line-height: 1.6; text-align: center;">
                    We'll contact you when your pure milk delivery is out on the route.<br />
                    Have questions? WhatsApp us at <strong style="color: #1B4D3E;">0310-9361932</strong>.
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
