if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side.');
}
import { Resend } from 'resend';

let resendInstance: Resend | null = null;

/**
 * Returns a singleton Resend client instance.
 * Strictly runs on the server side; API key is never exposed to the client.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_123456789_abcdefg') {
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
}

/**
 * Retrieves the verified from email header.
 * Defaults to a safe sender identity.
 */
export function getFromEmail(): string {
  const customFrom = process.env.EMAIL_FROM;
  if (customFrom && customFrom.trim().length > 0) {
    return customFrom.trim();
  }
  return 'Farm Fresh Dairy <orders@farmfreshdairy.pk>';
}

/**
 * Retrieves the admin notification email address.
 * Defaults to farmfreshdairy28@gmail.com.
 */
export function getAdminOrderEmail(): string {
  const adminEmail = process.env.ADMIN_ORDER_EMAIL;
  if (adminEmail && adminEmail.trim().length > 0) {
    return adminEmail.trim().toLowerCase();
  }
  return 'farmfreshdairy28@gmail.com';
}
