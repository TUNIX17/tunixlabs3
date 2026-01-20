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

  // Remove bold markers (**text** or __text__)
  sanitized = sanitized.replace(/\*\*([^*]+)\*\*/g, '$1');
  sanitized = sanitized.replace(/__([^_]+)__/g, '$1');

  // Remove italic markers (*text* or _text_) - careful not to match list items
  // Only match single asterisks/underscores surrounded by text
  sanitized = sanitized.replace(/(?<!\*)\*(?!\*)([^*\n]+)(?<!\*)\*(?!\*)/g, '$1');
  sanitized = sanitized.replace(/(?<!_)_(?!_)([^_\n]+)(?<!_)_(?!_)/g, '$1');

  // Remove strikethrough (~~text~~)
  sanitized = sanitized.replace(/~~([^~]+)~~/g, '$1');

  // Remove inline code (`code`)
  sanitized = sanitized.replace(/`([^`]+)`/g, '$1');

  // Remove code blocks (```code```)
  sanitized = sanitized.replace(/```[\s\S]*?```/g, '');

  // Remove list markers at start of lines and replace with periods for natural pauses
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

  // Ensure text ends properly (add period if it doesn't end with punctuation)
  if (sanitized && !/[.!?]$/.test(sanitized)) {
    sanitized += '.';
  }

  return sanitized;
}

/**
 * Check if text contains markdown formatting that would affect TTS
 * Useful for debugging or conditional processing
 *
 * @param text - The text to check
 * @returns true if markdown markers are detected
 */
export function containsMarkdown(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const markdownPatterns = [
    /\*\*[^*]+\*\*/,           // Bold
    /__[^_]+__/,               // Bold (alt)
    /(?<!\*)\*[^*\n]+\*(?!\*)/, // Italic
    /(?<!_)_[^_\n]+_(?!_)/,    // Italic (alt)
    /~~[^~]+~~/,               // Strikethrough
    /`[^`]+`/,                 // Inline code
    /^[\*\-\+]\s/m,            // Unordered list
    /^\d+\.\s/m,               // Ordered list
    /^#+\s/m,                  // Headers
    /^>\s/m,                   // Blockquotes
    /\[[^\]]+\]\([^)]+\)/,     // Links
    /!\[[^\]]*\]\([^)]+\)/,    // Images
  ];

  return markdownPatterns.some(pattern => pattern.test(text));
}

export default sanitizeForSpeech;
