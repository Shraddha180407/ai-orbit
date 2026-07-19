/**
 * Data transformation utilities for Device module
 */

/**
 * Generates a URL-friendly slug from a device name
 * @param name - The device name
 * @returns A slug string with lowercase alphanumeric characters and hyphens only
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove all non-word characters except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

/**
 * Validates and formats availability status
 * @param availability - The availability status
 * @returns A validated availability string
 * @throws Error if availability is not one of the allowed values
 */
export function validateAvailability(availability: string): string {
  const validAvailabilities = ['Available', 'Pre-order', 'Announced', 'Discontinued'];
  if (!validAvailabilities.includes(availability)) {
    throw new Error(`Invalid availability status. Must be one of: ${validAvailabilities.join(', ')}`);
  }
  return availability;
}

/**
 * Formats price as a string with currency symbol
 * @param price - The price value (can be string, number, or null)
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted price string or null
 */
export function formatPrice(price: string | number | null, currency: string = '$'): string | null {
  if (price === null || price === undefined || price === '') {
    return null;
  }

  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(priceNum)) {
    return null;
  }

  return `${currency}${priceNum.toFixed(2)}`;
}

/**
 * Formats month as a clean display string
 * @param month - The month value (can be Date, string, or null)
 * @returns Formatted month string (e.g., "Jan, 2024") or null
 */
export function formatMonth(month: Date | string | null): string | null {
  if (month === null || month === undefined || month === '') {
    return null;
  }

  let date: Date;
  if (month instanceof Date) {
    date = month;
  } else if (typeof month === 'string') {
    date = new Date(month);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) {
    return null;
  }

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return `${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}

/**
 * Parses comma-separated string into an array of strings
 * @param value - The comma-separated string
 * @returns Array of strings or null
 */
export function parseCommaSeparated(value: string | null): string[] | null {
  if (!value || value.trim() === '') {
    return null;
  }

  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '');
}

/**
 * Validates and returns fully qualified image URLs
 * @param url - The image URL
 * @returns Fully qualified URL or null
 */
export function validateImageUrl(url: string | null): string | null {
  if (!url || url.trim() === '') {
    return null;
  }

  // Ensure URL has a protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return null;
  }

  return url.trim();
}

/**
 * Transforms a Device database record into the API response format
 * @param device - The database device record
 * @returns Transformed device object for API response
 */
export function transformDeviceForListing(device: any): any {
  return {
    id: device.id,
    slug: device.slug,
    name: device.name,
    manufacturer: device.manufacturer,
    category: device.category,
    availability: validateAvailability(device.availability),
    price: formatPrice(device.price),
    year: device.year,
    month: formatMonth(device.month),
    description: device.description,
    imageUrl: validateImageUrl(device.imageUrl),
    manufacturerLogoUrl: validateImageUrl(device.manufacturerLogoUrl),
    mainTask: device.mainTask,
    formFactor: device.formFactor,
    country: device.country,
  };
}

/**
 * Transforms a Device database record into the detail API response format
 * @param device - The database device record
 * @returns Transformed device object for detail API response
 */
export function transformDeviceForDetail(device: any): any {
  const listingData = transformDeviceForListing(device);

  return {
    ...listingData,
    ram: device.ram,
    aiFeatures: parseCommaSeparated(device.aiFeatures),
    primaryUseCases: parseCommaSeparated(device.primaryUseCases),
    additionalInfo: device.additionalInfo,
    buyUrl: validateImageUrl(device.buyUrl),
  };
}
