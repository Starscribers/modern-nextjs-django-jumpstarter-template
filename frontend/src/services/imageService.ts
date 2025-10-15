import apiClient from '@/lib/api';

export interface ImageUploadResponse {
    originalImage?: string; // URL to the original image
    altText?: string; // Alternative text for the image
    title?: string; // Title of the image
}

export class ImageService {
  /**
   * Upload an image file to the server
   */
  static async uploadImage(
    file: File,
    title?: string,
    altText?: string,
    imageType: string = 'general'
  ): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('original_image', file);
    formData.append('title', title || file.name);
    formData.append('alt_text', altText || title || file.name);
    formData.append('image_type', imageType);

    // Do NOT set Content-Type manually; the interceptor will ensure it's removed so the browser sets the boundary
    const response = await apiClient.post('/api/v1/images/upload/', formData);

    return response.data;
  }

  /**
   * Get image details by ID
   */
  static async getImage(imageId: string): Promise<ImageUploadResponse> {
    const response = await apiClient.get(`/api/v1/images/${imageId}/`);
    return response.data;
  }

  /**
   * Get user's uploaded images
   */
  static async getUserImages(): Promise<ImageUploadResponse[]> {
    const response = await apiClient.get('/api/v1/images/my/');
    return response.data.results || response.data;
  }

  /**
   * Validate image file before upload
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please select a valid image file (JPEG, PNG, or WebP)'
      };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image file size must be less than 5MB'
      };
    }

    return { isValid: true };
  }
}

export const imageService = ImageService;
