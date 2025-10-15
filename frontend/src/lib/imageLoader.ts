/**
 * Custom Next.js image loader for backend images
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Custom loader for backend images
 * This bypasses Next.js image optimization for our backend images
 */
export const backendImageLoader = ({ src }: LoaderParams): string => {
  // If src is already a full URL, return as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If src is a relative path, prepend the API base URL
  if (src.startsWith('/')) {
    return `${API_BASE_URL}${src}`;
  }

  // If src doesn't start with /, add one
  return `${API_BASE_URL}/${src}`;
};

/**
 * Default loader that uses Next.js optimization for other images
 */
export const defaultImageLoader = ({
  src,
  width,
  quality,
}: LoaderParams): string => {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
};
