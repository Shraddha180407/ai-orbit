const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const TASK_COLORS: Record<string, string> = {
  "Gaming": "text-purple-500 bg-purple-100",
  "Productivity": "text-blue-500 bg-blue-100",
  "Creative": "text-pink-500 bg-pink-100",
  "Default": "text-gray-500 bg-gray-100"
};

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

export function formatMonth(month: Date | string | null): string | null {
  if (!month) {
    return null;
  }

  let date: Date;

  if (month instanceof Date) {
    date = month;
  } else if (typeof month === 'string') {
    const trimmed = month.trim();

    const textMatch = trimmed.match(/^([A-Za-z]+)[,\s]+(\d{4})$/);
    if (textMatch) {
      const monthStr = textMatch[1].substring(0, 3).toLowerCase();
      const year = parseInt(textMatch[2], 10);
      const monthIndex = MONTH_NAMES.findIndex(name => name.toLowerCase() === monthStr);
      
      if (monthIndex !== -1) {
        date = new Date(year, monthIndex, 1);
      } else {
        return null;
      }
    } else if (/^\d{4}-\d{2}/.test(trimmed)) {
      const [year, m] = trimmed.split('-');
      date = new Date(parseInt(year, 10), parseInt(m, 10) - 1, 1);
    } else {
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

export function parseCommaSeparated(value: string | null): string[] | null {
  if (!value || value.trim() === '') {
    return null;
  }

  return value
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '');
}

export function validateImageUrl(url: string | null): string | null {
  if (!url || url.trim() === '') {
    return null;
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return null;
  }

  return url.trim();
}

export function transformDeviceForListing(device: any): any {
  return {
    id: device.id,
    slug: device.slug,
    name: device.name,
    manufacturer: device.manufacturer,
    manufacturerSlug: generateSlug(device.manufacturer),
    category: device.category,
    availability: device.availability,
    price: formatPrice(device.price),
    year: device.year,
    month: formatMonth(device.month),
    description: device.description,
    imageUrl: validateImageUrl(device.imageUrl) || device.imageUrl || '',
    images: device.imageUrl ? [device.imageUrl] : [],
    manufacturerLogoUrl: validateImageUrl(device.manufacturerLogoUrl) || device.manufacturerLogoUrl || '',
    mainTask: device.mainTask,
    mainTaskColor: TASK_COLORS[device.mainTask] || TASK_COLORS["Default"],
    formFactor: device.formFactor,
    country: device.country,
    aiFeatures: device.aiFeatures || [],
    primaryUseCases: device.primaryUseCases || [],
    buyUrl: validateImageUrl(device.buyUrl) || device.buyUrl || null,
  };
}

export function transformDeviceForDetail(device: any): any {
  const listingData = transformDeviceForListing(device);

  return {
    ...listingData,
    ram: device.ram,
    additionalInfo: device.additionalInfo,
    tasks: device.tasks || []
  };
}