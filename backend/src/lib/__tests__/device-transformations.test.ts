import { describe, it, expect } from 'vitest';
import {
  generateSlug,
  formatPrice,
  formatMonth,
  parseCommaSeparated,
  validateImageUrl,
  transformDeviceForListing,
  transformDeviceForDetail,
} from '../device-transformations.js';

describe('generateSlug', () => {
  it('lowercases and trims whitespace', () => {
    expect(generateSlug('  Hello World  ')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(generateSlug('iPhone 15 Pro')).toBe('iphone-15-pro');
  });

  it('removes special characters', () => {
    expect(generateSlug('Galaxy S24 Ultra!')).toBe('galaxy-s24-ultra');
  });

  it('collapses multiple hyphens', () => {
    expect(generateSlug('a---b')).toBe('a-b');
  });

  it('strips leading and trailing hyphens', () => {
    expect(generateSlug('-hello-')).toBe('hello');
  });

  it('handles underscores as separators', () => {
    expect(generateSlug('my_device_name')).toBe('my-device-name');
  });

  it('returns empty string for empty input', () => {
    expect(generateSlug('')).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats a number with default currency', () => {
    expect(formatPrice(29.9)).toBe('$29.90');
  });

  it('formats a numeric string', () => {
    expect(formatPrice('99')).toBe('$99.00');
  });

  it('returns null for null input', () => {
    expect(formatPrice(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(formatPrice('')).toBeNull();
  });

  it('returns null for non-numeric string', () => {
    expect(formatPrice('free')).toBeNull();
  });

  it('uses custom currency symbol', () => {
    expect(formatPrice(50, '€')).toBe('€50.00');
  });

  it('handles zero correctly', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});

describe('formatMonth', () => {
  it('formats a Date object', () => {
    expect(formatMonth(new Date(2024, 0, 15))).toBe('Jan, 2024');
  });

  it('formats a YYYY-MM string', () => {
    expect(formatMonth('2024-03')).toBe('Mar, 2024');
  });

  it('formats a "Month, YYYY" text string', () => {
    expect(formatMonth('January, 2024')).toBe('Jan, 2024');
  });

  it('formats a "Month YYYY" text string without comma', () => {
    expect(formatMonth('March 2024')).toBe('Mar, 2024');
  });

  it('returns null for null input', () => {
    expect(formatMonth(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(formatMonth('')).toBeNull();
  });

  it('returns null for invalid month name', () => {
    expect(formatMonth('Smarch, 2024')).toBeNull();
  });

  it('returns null for invalid date string', () => {
    expect(formatMonth('not-a-date')).toBeNull();
  });

  it('handles YYYY-MM-DD format by using year and month', () => {
    expect(formatMonth('2024-12-25')).toBe('Dec, 2024');
  });
});

describe('parseCommaSeparated', () => {
  it('splits comma-separated values', () => {
    expect(parseCommaSeparated('a,b,c')).toEqual(['a', 'b', 'c']);
  });

  it('trims whitespace around values', () => {
    expect(parseCommaSeparated(' a , b , c ')).toEqual(['a', 'b', 'c']);
  });

  it('filters out empty entries from trailing commas', () => {
    expect(parseCommaSeparated('a,b,c,')).toEqual(['a', 'b', 'c']);
  });

  it('returns null for null input', () => {
    expect(parseCommaSeparated(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseCommaSeparated('')).toBeNull();
  });

  it('returns null for whitespace-only string', () => {
    expect(parseCommaSeparated('   ')).toBeNull();
  });

  it('handles a single value', () => {
    expect(parseCommaSeparated('solo')).toEqual(['solo']);
  });
});

describe('validateImageUrl', () => {
  it('returns the URL when valid https', () => {
    expect(validateImageUrl('https://example.com/img.png')).toBe('https://example.com/img.png');
  });

  it('returns the URL when valid http', () => {
    expect(validateImageUrl('http://example.com/img.png')).toBe('http://example.com/img.png');
  });

  it('trims surrounding whitespace', () => {
    expect(validateImageUrl('  https://example.com/img.png  ')).toBe('https://example.com/img.png');
  });

  it('returns null for null input', () => {
    expect(validateImageUrl(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(validateImageUrl('')).toBeNull();
  });

  it('returns null for URL without protocol', () => {
    expect(validateImageUrl('example.com/img.png')).toBeNull();
  });

  it('returns null for ftp protocol', () => {
    expect(validateImageUrl('ftp://example.com/img.png')).toBeNull();
  });
});

describe('transformDeviceForListing', () => {
  const baseDevice = {
    id: '1',
    slug: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    manufacturer: 'Apple',
    category: 'Phone',
    availability: 'Available',
    price: '999',
    year: 2024,
    month: '2024-09',
    description: 'A powerful phone',
    imageUrl: 'https://example.com/iphone.png',
    images: ['https://example.com/iphone.png'],
    manufacturerLogoUrl: 'https://example.com/apple-logo.png',
    mainTask: 'Productivity',
    formFactor: 'Bar',
    country: 'US',
    aiFeatures: ['Siri'],
    primaryUseCases: ['Work'],
    buyUrl: 'https://buy.example.com/iphone',
    ram: '8GB',
    additionalInfo: 'Titanium',
  };

  it('transforms all fields correctly', () => {
    const result = transformDeviceForListing(baseDevice as never);

    expect(result.id).toBe('1');
    expect(result.slug).toBe('iphone-15-pro');
    expect(result.name).toBe('iPhone 15 Pro');
    expect(result.manufacturer).toBe('Apple');
    expect(result.manufacturerSlug).toBe('apple');
    expect(result.price).toBe('$999.00');
    expect(result.month).toBe('Sep, 2024');
    expect(result.imageUrl).toBe('https://example.com/iphone.png');
    expect(result.images).toEqual(['https://example.com/iphone.png']);
    expect(result.manufacturerLogoUrl).toBe('https://example.com/apple-logo.png');
    expect(result.buyUrl).toBe('https://buy.example.com/iphone');
  });

  it('applies correct task color for known task', () => {
    const result = transformDeviceForListing(baseDevice as never);
    expect(result.mainTaskColor).toBe('text-blue-500 bg-blue-100');
  });

  it('applies default task color for unknown task', () => {
    const result = transformDeviceForListing({
      ...baseDevice,
      mainTask: 'UnknownTask',
    } as never);
    expect(result.mainTaskColor).toBe('text-gray-500 bg-gray-100');
  });

  it('handles null imageUrl', () => {
    const result = transformDeviceForListing({
      ...baseDevice,
      imageUrl: null,
      images: null,
    } as never);
    expect(result.imageUrl).toBe('');
    expect(result.images).toEqual([]);
  });

  it('handles null price', () => {
    const result = transformDeviceForListing({
      ...baseDevice,
      price: null,
    } as never);
    expect(result.price).toBeNull();
  });

  it('handles null buyUrl', () => {
    const result = transformDeviceForListing({
      ...baseDevice,
      buyUrl: null,
    } as never);
    expect(result.buyUrl).toBeNull();
  });

  it('defaults aiFeatures and primaryUseCases to empty arrays', () => {
    const result = transformDeviceForListing({
      ...baseDevice,
      aiFeatures: null,
      primaryUseCases: null,
    } as never);
    expect(result.aiFeatures).toEqual([]);
    expect(result.primaryUseCases).toEqual([]);
  });

  describe('transformDeviceForDetail', () => {
    it('includes videoUrl field when present', () => {
      const deviceWithVideo = {
        ...baseDevice,
        videoUrl: 'https://www.youtube.com/watch?v=example',
      } as never;
      
      const result = transformDeviceForDetail(deviceWithVideo);
      expect(result.videoUrl).toBe('https://www.youtube.com/watch?v=example');
    });

    it('sets videoUrl to null when not present', () => {
      const deviceWithoutVideo = {
        ...baseDevice,
        videoUrl: null,
      } as never;
      
      const result = transformDeviceForDetail(deviceWithoutVideo);
      expect(result.videoUrl).toBeNull();
    });

    it('includes images array from device', () => {
      const deviceWithImages = {
        ...baseDevice,
        images: ['https://example.com/device1.jpg', 'https://example.com/device2.jpg'],
      } as never;
      
      const result = transformDeviceForDetail(deviceWithImages);
      expect(result.images).toEqual(['https://example.com/device1.jpg', 'https://example.com/device2.jpg']);
    });

    it('includes empty images array when not present', () => {
      const deviceWithoutImages = {
        ...baseDevice,
        images: [],
      } as never;
      
      const result = transformDeviceForDetail(deviceWithoutImages);
      expect(result.images).toEqual([]);
    });
  });
});
