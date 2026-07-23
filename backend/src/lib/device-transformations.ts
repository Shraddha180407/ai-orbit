/**
 * Data transformation utilities for Device module
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Mappings for UI colors based on task types
const TASK_COLORS: Record<string, string> = {
  "Gaming": "text-purple-500 bg-purple-100",
  "Productivity": "text-blue-500 bg-blue-100",
  "Creative": "text-pink-500 bg-pink-100",
  "Default": "text-gray-500 bg-gray-100"
};

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
  if (!month) {
    return null;
  }

  let date: Date;

  if (month instanceof Date) {
    date = month;
  } else if (typeof month === 'string') {
    const trimmed = month.trim();

    // 1. Handle "Jan, 2024" or "January 2024" format
    const textMatch = trimmed.match(/^([A-Za-z]+)[,\s]+(\d{4})$/);
    if (textMatch) {
      // Grab first 3 letters to match our array (e.g., "Jan" from "January")
      const monthStr = textMatch[1].substring(0, 3).toLowerCase();
      const year = parseInt(textMatch[2], 10);
      const monthIndex = MONTH_NAMES.findIndex(name => name.toLowerCase() === monthStr);
      
      if (monthIndex !== -1) {
        // Construct as local time to prevent timezone shift issues
        date = new Date(year, monthIndex, 1);
      } else {
        return null;
      }
    } 
    // 2. Handle standard "YYYY-MM" or "YYYY-MM-DD" database strings safely
    else if (/^\d{4}-\d{2}/.test(trimmed)) {
      const [year, m] = trimmed.split('-');
      // Construct as local time: Month is 0-indexed in JS Date
      date = new Date(parseInt(year, 10), parseInt(m, 10) - 1, 1);
    } 
    // 3. Fallback for completely unknown formats
    else {
      date = new Date(trimmed);
    }
  } else {
    return null;
  }

  if (isNaN(date.getTime())) {
    return null;
  }

  return `${MONTH_NAMES[date.getMonth()]}, ${date.getFullYear()}`;
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
    
    // NEW: Generated UI Fields
    manufacturerSlug: generateSlug(device.manufacturer),
    
    category: device.category,
    availability: device.availability, // Safely passed through from Prisma Enum
    price: formatPrice(device.price),
    year: device.year,
    month: formatMonth(device.month),
    description: device.description,
    
    // REQUIRED: Fallback to original string so it never returns null
    imageUrl: validateImageUrl(device.imageUrl) || device.imageUrl || '',
    images: device.imageUrl ? [device.imageUrl] : [], // NEW: Wrapped in array
    manufacturerLogoUrl: validateImageUrl(device.manufacturerLogoUrl) || device.manufacturerLogoUrl || '',
    
    mainTask: device.mainTask,
    mainTaskColor: TASK_COLORS[device.mainTask] || TASK_COLORS["Default"], // NEW: Mapped UI color
    
    formFactor: device.formFactor,
    country: device.country,
    aiFeatures: device.aiFeatures || [],
    primaryUseCases: device.primaryUseCases || [],
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
    additionalInfo: device.additionalInfo,
    buyUrl: validateImageUrl(device.buyUrl), // Optional field, so null is fine here
    tasks: device.tasks || [] // Include relational tasks if fetched from DB
  };
}