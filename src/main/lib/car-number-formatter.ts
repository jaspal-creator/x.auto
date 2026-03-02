/**
 * Backend Car Number Formatter
 * Handles different car registration number formats on the server side:
 * - XXX 456 (3 letters + space + 3 digits)
 * - XXX 34 (3 letters + space + 2 digits)
 * - XXX 1 (3 letters + space + 1 digit)
 * - CH SH 132 (2 letters + space + 2 letters + space + 3 digits)
 * - OR SK 123 (2 letters + space + 2 letters + space + 3 digits)
 */

export const formatCarNumber = (input: string): string => {
  if (!input) return '';

  // Remove all spaces and convert to uppercase
  const cleaned = input.replace(/\s/g, '').toUpperCase();

  // If empty, return empty
  if (!cleaned) return '';

  // Smart formatting based on detected patterns

  // Pattern 1: Exactly 4 letters + 1-3 digits (CHSH132 -> CH SH 132)
  const fourLettersDigitsMatch = cleaned.match(/^([A-Z]{2})([A-Z]{2})(\d{1,3})$/);
  if (fourLettersDigitsMatch) {
    const [, firstPart, secondPart, digits] = fourLettersDigitsMatch;
    return `${firstPart} ${secondPart} ${digits}`;
  }

  // Pattern 2: Exactly 3 letters + 1-3 digits (ABC123 -> ABC 123)
  const threeLettersDigitsMatch = cleaned.match(/^([A-Z]{3})(\d{1,3})$/);
  if (threeLettersDigitsMatch) {
    const [, letters, digits] = threeLettersDigitsMatch;
    return `${letters} ${digits}`;
  }

  // Intelligent partial formatting for incomplete inputs

  // Case: 4+ characters starting with 2 letters, could be 2+2+digits pattern
  if (cleaned.length >= 4 && /^[A-Z]{2}[A-Z]/.test(cleaned)) {
    const firstPart = cleaned.substring(0, 2);

    // If we have at least 4 letters, try 2+2 pattern
    if (cleaned.length >= 4 && /^[A-Z]{4}/.test(cleaned)) {
      const secondPart = cleaned.substring(2, 4);
      const rest = cleaned.substring(4);

      // If there are digits after 4 letters, format as 2+2+digits
      if (rest && /^\d/.test(rest)) {
        return `${firstPart} ${secondPart} ${rest}`;
      }
      // If only 4 letters so far, format as 2+2
      else if (cleaned.length === 4) {
        return `${firstPart} ${secondPart}`;
      }
      // If more letters after 4, might be typing more, keep partial format
      else {
        return `${firstPart} ${secondPart}${rest}`;
      }
    }
    // Less than 4 characters starting with 2 letters
    else {
      const rest = cleaned.substring(2);
      return `${firstPart} ${rest}`;
    }
  }

  // Case: 3+ characters starting with 3 letters, could be 3+digits pattern
  else if (cleaned.length >= 3 && /^[A-Z]{3}/.test(cleaned)) {
    const letters = cleaned.substring(0, 3);
    const rest = cleaned.substring(3);

    // If there's something after the 3 letters
    if (rest) {
      // If it starts with a digit, add space before digits
      if (/^\d/.test(rest)) {
        return `${letters} ${rest}`;
      }
      // If it's more letters, might still be typing
      else {
        return `${letters}${rest}`;
      }
    }
    // Just 3 letters so far
    else {
      return letters;
    }
  }

  // Case: Less than 3 characters, just return as-is
  else if (cleaned.length <= 3) {
    return cleaned;
  }

  // Fallback: try to detect pattern from mixed input
  // Look for transitions from letters to digits
  const letterToDigitMatch = cleaned.match(/^([A-Z]+)(\d+)$/);
  if (letterToDigitMatch) {
    const [, letters, digits] = letterToDigitMatch;

    // If 2 letters + digits, might be incomplete 2+2+digits pattern
    if (letters.length === 2) {
      return `${letters} ${digits}`;
    }
    // If 3 letters + digits, format as 3+digits
    else if (letters.length === 3) {
      return `${letters} ${digits}`;
    }
    // If 4 letters + digits, format as 2+2+digits
    else if (letters.length === 4) {
      const firstPart = letters.substring(0, 2);
      const secondPart = letters.substring(2, 4);
      return `${firstPart} ${secondPart} ${digits}`;
    }
  }

  // Default fallback - return cleaned input
  return cleaned;
};

export const validateCarNumber = (carNumber: string): boolean => {
  if (!carNumber) return false;

  const trimmed = carNumber.trim();

  // Check length constraints (minimum 5 for "XXX 1", maximum 10 for "CH SH 132")
  if (trimmed.length < 5 || trimmed.length > 10) {
    return false;
  }

  // Remove spaces for pattern matching
  const cleaned = trimmed.replace(/\s/g, '').toUpperCase();

  // Valid patterns:
  // 1. XXX###, XXX##, XXX# (3 letters + 1-3 digits)
  // 2. XXXX### (2 letters + 2 letters + 1-3 digits)
  const patterns = [
    /^[A-Z]{3}\d{1,3}$/, // XXX1, XXX12, XXX123
    /^[A-Z]{2}[A-Z]{2}\d{1,3}$/ // CHSH123, ORSK123
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
};

export const normalizeCarNumber = (carNumber: string): string => {
  // This function ensures consistent formatting for storage/comparison
  return formatCarNumber(carNumber);
};
