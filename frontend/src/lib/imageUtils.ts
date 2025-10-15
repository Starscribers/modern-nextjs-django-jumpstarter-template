/**
 * Utility functions for handling image URLs
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Convert a relative image URL to an absolute URL
 * @param relativeUrl - The relative URL from the API
 * @returns Absolute URL for the image
 */
export function getAbsoluteImageUrl(
  relativeUrl: string | null | undefined
): string | null {
  if (!relativeUrl) return null;

  // If it's already an absolute URL, return as is
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }

  // If it's a relative URL, prepend the API base URL
  if (relativeUrl.startsWith('/')) {
    return `${API_BASE_URL}${relativeUrl}`;
  }

  return `${API_BASE_URL}/${relativeUrl}`;
}

/**
 * Get the best image URL for display (prefers optimized, falls back to original)
 * @param imageData - Image data from the API
 * @returns Best available image URL
 */
export function getBestImageUrl(
  imageData:
    | {
        url?: string;
        optimized_image?: string;
        original_image?: string;
      }
    | null
    | undefined
): string | null {
  if (!imageData) return null;

  // Use the url property if available (it contains the best URL logic from backend)
  if (imageData.url) {
    return getAbsoluteImageUrl(imageData.url);
  }

  // Fallback to optimized, then original
  const relativeUrl = imageData.optimized_image || imageData.original_image;
  return getAbsoluteImageUrl(relativeUrl);
}

/**
 * Get the thumbnail URL for an image
 * @param imageData - Image data from the API
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(
  imageData:
    | {
        thumbnail_url?: string;
        thumbnail?: string;
        url?: string;
        optimized_image?: string;
        original_image?: string;
      }
    | null
    | undefined
): string | null {
  if (!imageData) return null;

  // Use thumbnail_url if available
  if (imageData.thumbnail_url) {
    return getAbsoluteImageUrl(imageData.thumbnail_url);
  }

  // Fallback to thumbnail field
  if (imageData.thumbnail) {
    return getAbsoluteImageUrl(imageData.thumbnail);
  }

  // Ultimate fallback to best image URL
  return getBestImageUrl(imageData);
}
