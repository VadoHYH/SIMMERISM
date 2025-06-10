// src/lib/utils.ts

/**
 * Normalize a multi-line field (.zh) into a clean string array.
 * Automatically handles if input is string or array.
 */
export function normalizeMultilineZh(fieldZh?: string | string[]): string[] {
    if (!fieldZh) return [];
  
    if (Array.isArray(fieldZh)) {
      return fieldZh;
    }
  
    // Use newline to split, clean up whitespace, remove empty items.
    return fieldZh
      .split('\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
  }
  