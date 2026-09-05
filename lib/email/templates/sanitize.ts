/**
 * Escapes HTML entities to prevent Cross-Site Scripting (XSS) in generated emails.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats Pakistani Rupee amounts
 */
export function formatCurrency(amount: number | string): string {
  const num = Number(amount) || 0;
  return `Rs. ${num.toLocaleString('en-PK')}`;
}
