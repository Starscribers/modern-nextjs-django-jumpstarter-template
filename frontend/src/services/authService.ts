import apiClient from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';

export class AuthService {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Use Django JWT token endpoint
    const response = await apiClient.post('/api/v1/auth/token/', {
      username: credentials.username, // Support both email and username
      password: credentials.password,
    });

    const tokenData = response.data;

    // Store token in localStorage
    if (typeof window !== 'undefined' && tokenData.access) {
      localStorage.setItem('authToken', tokenData.access);
      localStorage.setItem('refreshToken', tokenData.refresh);
    }

    // Get user data with the token
    const userResponse = await apiClient.get('/api/v1/auth/profile/', {
      headers: {
        Authorization: `Bearer ${tokenData.access}`,
      },
    });

    const authData: AuthResponse = {
      token: tokenData.access,
      refreshToken: tokenData.refresh,
      user: userResponse.data,
    };

    // Store user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(authData.user));
    }

    return authData;
  }

  // Register user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    await apiClient.post('/api/v1/auth/register/', userData);

    // After registration, log the user in
    return this.login({
      username: userData.email,
      password: userData.password,
    });
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      const refreshToken =
        typeof window !== 'undefined'
          ? localStorage.getItem('refreshToken')
          : null;
      if (refreshToken) {
        // Blacklist the refresh token
        await apiClient.post('/auth/token/blacklist/', {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiClient.get('/api/v1/auth/profile/');
    const userData = response.data;

    // Update stored user data
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return userData;
  }

  // Refresh access token
  static async refreshToken(): Promise<string> {
    const refreshToken =
      typeof window !== 'undefined'
        ? localStorage.getItem('refreshToken')
        : null;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/api/v1/auth/token/refresh/', {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;

    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', newAccessToken);
    }

    return newAccessToken;
  }


  // Check if user is logged in
  static isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  }

  // Get stored user data
  static getStoredUser(): AuthResponse['user'] | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Export an instance for easy use
export const authService = AuthService;
