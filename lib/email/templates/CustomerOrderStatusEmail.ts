import { Order, OrderStatus } from '@/lib/types';
import { renderEmailHeader } from './EmailHeader';
import { renderEmailFooter } from './EmailFooter';
import { escapeHtml, formatCurrency } from './sanitize';

export function getStatusEmailSubject(orderNumber: string, status: OrderStatus): string {
  switch (status) {
    case 'Confirmed':
      return `Your Farm Fresh Dairy Order #${orderNumber} is Confirmed`;
    case 'Out for Delivery':
      return `Your Farm Fresh Dairy Order #${orderNumber} is Out for Delivery 🚚`;
    case 'Delivered':
      return `Your Farm Fresh Dairy Order #${orderNumber} Has Been Delivered`;
    case 'Cancelled':
      return `Update Regarding Your Farm Fresh Dairy Order #${orderNumber}`;
    default:
      return `Status Update for Your Farm Fresh Dairy Order #${orderNumber}`;
  }
}

export function generateCustomerOrderStatusHtml(order: Order, newStatus: OrderStatus): string {
  const safeCustomerName = escapeHtml(order.customer_name);
  const safeOrderNumber = escapeHtml(order.order_number);
  const safeStatus = escapeHtml(newStatus);
  const safeTotal = formatCurrency(order.total_amount);

  let statusHeading = '';
  let statusMessage = '';
  let statusBadgeColor = '#1B4D3E';
  let statusBgColor = '#E7F3ED';

  switch (newStatus) {
    case 'Confirmed':
      statusHeading = 'Order Confirmed & Slotted for Morning Delivery';
      statusMessage = 'Great news! Your pure milk delivery has been confirmed by our farm team and scheduled for morning dispatch between 6:00 AM and 9:00 AM.';
      statusBadgeColor = '#065F46';
      statusBgColor = '#D1FAE5';
      break;
    case 'Out for Delivery':
      statusHeading = 'Your Chilled Dairy is on the Way!';
      statusMessage = 'Our chilled delivery driver is out on the route. Please keep your collection vessels or doorstep area ready for delivery.';
      statusBadgeColor = '#1E40AF';
      statusBgColor = '#DBEAFE';
      break;
    case 'Delivered':
      statusHeading = 'Order Successfully Delivered!';
      statusMessage = 'Your fresh farm milk and dairy products have been delivered. Thank you for choosing 100% pure, natural milk for your family!';
      statusBadgeColor = '#065F46';
      statusBgColor = '#D1FAE5';
      break;
    case 'Cancelled':
      statusHeading = 'Order Update — Cancelled';
      statusMessage = 'Your order has been cancelled. If you did not request this cancellation or would like to re-order, please contact our dispatch desk at 0310-9361932.';
      statusBadgeColor = '#991B1B';
      statusBgColor = '#FEE2E2';
      break;
    default:
      statusHeading = `Order Status: ${safeStatus}`;
      statusMessage = `Your order status has been updated to ${safeStatus}.`;
      break;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getStatusEmailSubject(safeOrderNumber, newStatus)}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F8F5; font-family: 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F4F8F5; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5ECE8; box-shadow: 0 4px 12px rgba(0,0,0,0.04); overflow: hidden;">
              
              <!-- Header -->
              <tr>
                <td>
                  ${renderEmailHeader('Order Status Notification')}
                </td>
              </tr>

              <!-- Content Body -->
              <tr>
                <td style="padding: 32px 28px;">
                  
                  <div style="margin-bottom: 24px;">
                    <span style="display: inline-block; background-color: ${statusBgColor}; color: ${statusBadgeColor}; font-size: 11px; font-weight: bold; font-family: monospace; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; margin-bottom: 12px;">
                      Status: ${safeStatus}
                    </span>
                    <h2 style="margin: 0 0 8px 0; color: #1A2621; font-family: Georgia, serif; font-size: 22px;">
                      ${statusHeading}
                    </h2>
                    <p style="margin: 0; color: #4A5B53; font-size: 14px; line-height: 1.6;">
                      Hi ${safeCustomerName},
                    </p>
                    <p style="margin: 8px 0 0 0; color: #4A5B53; font-size: 14px; line-height: 1.6;">
                      ${statusMessage}
                    </p>
                  </div>

                  <!-- Order Info Card -->
                  <table width="100%" cellpadding="14" cellspacing="0" border="0" style="background-color: #F8FAF9; border: 1px solid #E5ECE8; border-radius: 12px; margin-bottom: 24px; font-size: 13px; line-height: 1.6;">
                    <tr>
                      <td>
                        <table width="100%" cellpadding="4" cellspacing="0" border="0">
                          <tr>
                            <td style="color: #61736A;">Order Number:</td>
                            <td style="font-family: monospace; font-weight: bold; color: #1B4D3E; text-align: right;">#${safeOrderNumber}</td>
                          </tr>
                          <tr>
                            <td style="color: #61736A;">Total Amount:</td>
                            <td style="font-family: monospace; font-weight: bold; color: #1B4D3E; text-align: right;">${safeTotal}</td>
                          </tr>
                          <tr>
                            <td style="color: #61736A;">Delivery Route:</td>
                            <td style="font-weight: 600; color: #2C3E35; text-align: right;">${escapeHtml(order.area_name)}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 0; color: #5B6B64; font-size: 13px; line-height: 1.6; text-align: center;">
                    If you have questions about this update, WhatsApp or call us at <strong style="color: #1B4D3E;">0310-9361932</strong>.
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
