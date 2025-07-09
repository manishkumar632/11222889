/**
 * Validate if a string is a valid URL
 * @param url URL string to validate
 * @returns True if valid URL, false otherwise
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate if a string is a valid shortcode format
 * @param shortcode Shortcode string to validate
 * @returns True if valid shortcode, false otherwise
 */
export const isValidShortcode = (shortcode: string): boolean => {
  // Only allow alphanumeric characters and length between 4-12 chars
  const regex = /^[a-zA-Z0-9]{4,12}$/;
  return regex.test(shortcode);
};

/**
 * Validate if a number is a valid validity value
 * @param validity Number of minutes for validity
 * @returns True if valid validity value, false otherwise
 */
export const isValidValidity = (validity: number): boolean => {
  // Must be a positive number
  return !isNaN(validity) && validity > 0;
};

export default {
  isValidUrl,
  isValidShortcode,
  isValidValidity,
};
