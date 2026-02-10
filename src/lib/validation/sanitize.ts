/**
 * Input sanitization utilities for preventing XSS, CSV injection,
 * and email header injection attacks.
 */

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Sanitize string for CSV to prevent formula injection.
 * Prefixes dangerous characters that could be interpreted as formulas in Excel/Sheets.
 */
export function sanitizeForCSV(field: string): string {
  if (typeof field !== 'string') return String(field);
  // If starts with =, +, -, @, tab, or carriage return, prefix with single quote
  if (/^[=+\-@\t\r]/.test(field)) {
    field = "'" + field;
  }
  // Standard CSV escaping
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Sanitize all string fields in a lead data object.
 * Applies HTML escaping to every string and string-array value.
 */
export function sanitizeLeadStrings<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = escapeHtml(value);
    }
    if (Array.isArray(value)) {
      (result as Record<string, unknown>)[key] = value.map((v) =>
        typeof v === 'string' ? escapeHtml(v) : v
      );
    }
  }
  return result;
}

/**
 * Sanitize email subject to prevent header injection.
 * Strips newlines and null bytes that could inject additional headers.
 */
export function sanitizeEmailSubject(subject: string): string {
  return subject.replace(/[\r\n\0]/g, '').trim();
}
