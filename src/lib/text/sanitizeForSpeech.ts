/**
 * Text sanitization utilities for Text-to-Speech
 * Removes markdown formatting that would be read literally by TTS engines
 * Works for both Spanish and English text
 */

/**
 * Sanitizes text for speech synthesis by removing markdown formatting
 * that would be read literally (asterisks, dashes, etc.)
 *
 * @param text - The text to sanitize
 * @returns Text cleaned of markdown markers, ready for TTS
 *
 * @example
 * sanitizeForSpeech("* Item one\n* Item two") // "Item one. Item two"
 * sanitizeForSpeech("**Bold** text") // "Bold text"
 * sanitizeForSpeech("- First\n- Second") // "First. Second"
 */
export function sanitizeForSpeech(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let sanitized = text;

  // Remove code blocks first (```code```) - before other processing
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '');

  // Remove inline code (`code`)
  sanitized = sanitized.replace(/`([^`]+)`/g, '$1');

  // Remove bold markers (**text** or __text__)
  sanitized = sanitized.replace(/\*\*([^*]+)\*\*/g, '$1');
  sanitized = sanitized.replace(/__([^_]+)__/g, '$1');

  // Remove italic markers - simpler approach without lookbehind
  // Match *text* where text doesn't contain * or newlines
  sanitized = sanitized.replace(/\*([^*\n]+)\*/g, '$1');
  // Match _text_ where text doesn't contain _ or newlines
  sanitized = sanitized.replace(/_([^_\n]+)_/g, '$1');

  // Remove strikethrough (~~text~~)
  sanitized = sanitized.replace(/~~([^~]+)~~/g, '$1');

  // Remove list markers at start of lines
  // Handles: * item, - item, + item, numbered lists (1. item)
  sanitized = sanitized.replace(/^\s*[\*\-\+]\s+/gm, '');
  sanitized = sanitized.replace(/^\s*\d+\.\s+/gm, '');

  // Remove markdown headers (#, ##, ###, etc.)
  sanitized = sanitized.replace(/^#+\s*/gm, '');

  // Remove blockquotes (> text)
  sanitized = sanitized.replace(/^>\s*/gm, '');

  // Remove horizontal rules (---, ***, ___)
  sanitized = sanitized.replace(/^[-*_]{3,}\s*$/gm, '');

  // Remove markdown links [text](url) - keep just the text
  sanitized = sanitized.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove markdown images ![alt](url)
  sanitized = sanitized.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // Remove HTML tags if any
  sanitized = sanitized.replace(/<[^>]+>/g, '');

  // Convert multiple newlines to periods for natural pauses
  sanitized = sanitized.replace(/\n{2,}/g, '. ');

  // Convert single newlines to spaces
  sanitized = sanitized.replace(/\n/g, ' ');

  // Clean up multiple spaces
  sanitized = sanitized.replace(/\s{2,}/g, ' ');

  // Clean up multiple periods
  sanitized = sanitized.replace(/\.{2,}/g, '.');

  // Clean up period-space-period
  sanitized = sanitized.replace(/\.\s*\./g, '.');

  // Remove leading/trailing whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

export default sanitizeForSpeech;
