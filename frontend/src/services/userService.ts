import apiClient from '@/lib/api';
import { UserDetail, UserProfile, UserSettings } from '@/types/api';
export class UserService {
  // Get current user profile
  static async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/api/v1/auth/profile/detailed/');
    return response.data;
  }

  // Update basic user information
  static async updateBasicInfo(data: Partial<UserDetail>): Promise<any> {
    const response = await apiClient.put('/api/v1/auth/profile/update/', data);
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.put(
      '/api/v1/auth/profile/detailed/',
      data
    );
    return response.data;
  }

  // Get user settings
  static async getUserSettings(): Promise<UserSettings> {
    const response = await apiClient.get('/api/v1/auth/settings/');
    return response.data;
  }

  // Update user settings
  static async updateSettings(
    settings: Partial<UserSettings>
  ): Promise<UserSettings> {
    const response = await apiClient.put('/api/v1/auth/settings/', settings);
    return response.data;
  }

  // Change password
  static async changePassword(data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> {
    await apiClient.post('/auth/change-password/', data);
  }

  // Delete account
  static async deleteAccount(password: string): Promise<void> {
    await apiClient.post('/auth/account/delete/', { password });
  }

  // Export user data
  static async exportUserData(): Promise<object> {
    const response = await apiClient.get('/auth/account/export/');
    return response.data;
  }

  // Upload avatar
  static async uploadAvatar(file: File): Promise<UserDetail> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post(
      '/api/v1/auth/profile/avatar/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }
}

// Export an instance for easy use
export const userService = UserService;
