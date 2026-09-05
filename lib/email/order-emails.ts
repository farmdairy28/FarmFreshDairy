if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side.');
}
import { Order, OrderItem, OrderStatus } from '@/lib/types';
import { createAdminClient } from '@/lib/supabase/admin';
import { getResendClient, getFromEmail, getAdminOrderEmail } from './resend';
import { generateCustomerOrderConfirmationHtml } from './templates/CustomerOrderConfirmationEmail';
import { generateAdminNewOrderHtml } from './templates/AdminNewOrderEmail';
import { generateCustomerOrderStatusHtml, getStatusEmailSubject } from './templates/CustomerOrderStatusEmail';

export type EmailNotificationType =
  | 'CUSTOMER_ORDER_CONFIRMATION'
  | 'ADMIN_NEW_ORDER'
  | 'CUSTOMER_ORDER_STATUS_CONFIRMED'
  | 'CUSTOMER_ORDER_STATUS_OUT_FOR_DELIVERY'
  | 'CUSTOMER_ORDER_STATUS_DELIVERED'
  | 'CUSTOMER_ORDER_STATUS_CANCELLED'
  | 'CUSTOMER_ORDER_STATUS_UPDATE';

export interface EmailSendResult {
  recipient: string;
  type: EmailNotificationType;
  success: boolean;
  messageId?: string;
  skipped?: boolean;
  error?: string;
}

/**
 * Validates email format strictly
 */
export function isValidEmail(email?: string | null): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  // Standard RFC 5322 compliant regex for practical email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Checks if a specific email notification has already been successfully sent for this order.
 */
async function hasNotificationBeenSent(
  orderId: string,
  emailType: EmailNotificationType,
  recipient: string
): Promise<boolean> {
  try {
    const adminClient = createAdminClient();
    if (!adminClient) return false;

    const { data } = await adminClient
      .from('order_email_notifications')
      .select('id, status')
      .eq('order_id', orderId)
      .eq('email_type', emailType)
      .eq('recipient', recipient.toLowerCase().trim())
      .eq('status', 'SENT')
      .maybeSingle();

    return !!data;
  } catch (err) {
    console.warn('[Email Deduplication Check Warning]:', err);
    return false;
  }
}

/**
 * Records or updates the email notification state in Supabase.
 */
async function logNotificationAttempt(
  orderId: string,
  emailType: EmailNotificationType,
  recipient: string,
  status: 'SENT' | 'FAILED' | 'PENDING',
  providerMessageId?: string | null,
  error?: string | null
): Promise<void> {
  try {
    const adminClient = createAdminClient();
    if (!adminClient) return;

    const normalizedRecipient = recipient.toLowerCase().trim();

    // Upsert notification tracking record
    await adminClient
      .from('order_email_notifications')
      .upsert(
        {
          order_id: orderId,
          email_type: emailType,
          recipient: normalizedRecipient,
          status,
          provider_message_id: providerMessageId || null,
          last_error: error || null,
          sent_at: status === 'SENT' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'order_id,email_type,recipient',
        }
      );
  } catch (err) {
    console.warn('[Email Log Notification Warning]:', err);
  }
}

/**
 * Sends customer order confirmation and admin alert emails.
 * Guarantees idempotency and safe error isolation (never crashes order flow).
 */
export async function sendOrderEmails({
  order,
  items,
}: {
  order: Order;
  items?: OrderItem[];
}): Promise<{
  customerResult: EmailSendResult;
  adminResult: EmailSendResult;
}> {
  const resend = getResendClient();
  const fromEmail = getFromEmail();
  const adminEmail = getAdminOrderEmail();
  const customerEmail = (order.customer_email || '').trim().toLowerCase();

  const customerResult: EmailSendResult = {
    recipient: customerEmail,
    type: 'CUSTOMER_ORDER_CONFIRMATION',
    success: false,
  };

  const adminResult: EmailSendResult = {
    recipient: adminEmail,
    type: 'ADMIN_NEW_ORDER',
    success: false,
  };

  // -------------------------------------------------------------
  // 1. CUSTOMER CONFIRMATION EMAIL
  // -------------------------------------------------------------
  if (!isValidEmail(customerEmail)) {
    customerResult.skipped = true;
    customerResult.error = 'No valid customer email provided.';
  } else {
    try {
      const alreadySent = await hasNotificationBeenSent(order.id, 'CUSTOMER_ORDER_CONFIRMATION', customerEmail);

      if (alreadySent) {
        customerResult.skipped = true;
        customerResult.success = true;
      } else if (!resend) {
        customerResult.error = 'Resend API key not configured.';
        console.warn('[Email Notice]: Resend is not configured (missing RESEND_API_KEY). Customer email skipped.');
      } else {
        const subject = `Thank You for Your Order! — Order #${order.order_number}`;
        const html = generateCustomerOrderConfirmationHtml(order, items);

        const response = await resend.emails.send({
          from: fromEmail,
          to: customerEmail,
          subject,
          html,
        });

        if (response.error) {
          customerResult.error = response.error.message;
          await logNotificationAttempt(
            order.id,
            'CUSTOMER_ORDER_CONFIRMATION',
            customerEmail,
            'FAILED',
            null,
            response.error.message
          );
        } else if (response.data?.id) {
          customerResult.success = true;
          customerResult.messageId = response.data.id;
          await logNotificationAttempt(
            order.id,
            'CUSTOMER_ORDER_CONFIRMATION',
            customerEmail,
            'SENT',
            response.data.id,
            null
          );
        }
      }
    } catch (err: any) {
      console.error('[Customer Email Exception]:', err?.message || err);
      customerResult.error = err?.message || 'Email delivery exception';
      await logNotificationAttempt(
        order.id,
        'CUSTOMER_ORDER_CONFIRMATION',
        customerEmail,
        'FAILED',
        null,
        customerResult.error
      );
    }
  }

  // -------------------------------------------------------------
  // 2. ADMIN NEW ORDER NOTIFICATION EMAIL
  // -------------------------------------------------------------
  try {
    const alreadySent = await hasNotificationBeenSent(order.id, 'ADMIN_NEW_ORDER', adminEmail);

    if (alreadySent) {
      adminResult.skipped = true;
      adminResult.success = true;
    } else if (!resend) {
      adminResult.error = 'Resend API key not configured.';
      console.warn('[Email Notice]: Resend is not configured (missing RESEND_API_KEY). Admin alert skipped.');
    } else {
      const subject = `🛒 New Order Received — #${order.order_number}`;
      const html = generateAdminNewOrderHtml(order, items);

      const response = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject,
        html,
      });

      if (response.error) {
        adminResult.error = response.error.message;
        await logNotificationAttempt(
          order.id,
          'ADMIN_NEW_ORDER',
          adminEmail,
          'FAILED',
          null,
          response.error.message
        );
      } else if (response.data?.id) {
        adminResult.success = true;
        adminResult.messageId = response.data.id;
        await logNotificationAttempt(
          order.id,
          'ADMIN_NEW_ORDER',
          adminEmail,
          'SENT',
          response.data.id,
          null
        );
      }
    }
  } catch (err: any) {
    console.error('[Admin Email Exception]:', err?.message || err);
    adminResult.error = err?.message || 'Admin email delivery exception';
    await logNotificationAttempt(
      order.id,
      'ADMIN_NEW_ORDER',
      adminEmail,
      'FAILED',
      null,
      adminResult.error
    );
  }

  return { customerResult, adminResult };
}

/**
 * Sends order status update emails to the customer upon lifecycle state transitions.
 * Guaranteed idempotent: repeated calls with identical status will NOT send duplicate emails.
 */
export async function sendStatusUpdateEmail({
  order,
  newStatus,
}: {
  order: Order;
  newStatus: OrderStatus;
}): Promise<EmailSendResult> {
  const customerEmail = (order.customer_email || '').trim().toLowerCase();
  const emailType: EmailNotificationType =
    newStatus === 'Confirmed'
      ? 'CUSTOMER_ORDER_STATUS_CONFIRMED'
      : newStatus === 'Out for Delivery'
      ? 'CUSTOMER_ORDER_STATUS_OUT_FOR_DELIVERY'
      : newStatus === 'Delivered'
      ? 'CUSTOMER_ORDER_STATUS_DELIVERED'
      : newStatus === 'Cancelled'
      ? 'CUSTOMER_ORDER_STATUS_CANCELLED'
      : 'CUSTOMER_ORDER_STATUS_UPDATE';

  const result: EmailSendResult = {
    recipient: customerEmail,
    type: emailType,
    success: false,
  };

  if (!isValidEmail(customerEmail)) {
    result.skipped = true;
    result.error = 'No customer email provided for status notification.';
    return result;
  }

  try {
    const alreadySent = await hasNotificationBeenSent(order.id, emailType, customerEmail);

    if (alreadySent) {
      result.skipped = true;
      result.success = true;
      return result;
    }

    const resend = getResendClient();
    if (!resend) {
      result.error = 'Resend API key not configured.';
      return result;
    }

    const fromEmail = getFromEmail();
    const subject = getStatusEmailSubject(order.order_number, newStatus);
    const html = generateCustomerOrderStatusHtml(order, newStatus);

    const response = await resend.emails.send({
      from: fromEmail,
      to: customerEmail,
      subject,
      html,
    });

    if (response.error) {
      result.error = response.error.message;
      await logNotificationAttempt(order.id, emailType, customerEmail, 'FAILED', null, response.error.message);
    } else if (response.data?.id) {
      result.success = true;
      result.messageId = response.data.id;
      await logNotificationAttempt(order.id, emailType, customerEmail, 'SENT', response.data.id, null);
    }
  } catch (err: any) {
    console.error('[Status Email Exception]:', err?.message || err);
    result.error = err?.message || 'Status email delivery exception';
    await logNotificationAttempt(order.id, emailType, customerEmail, 'FAILED', null, result.error);
  }

  return result;
}
