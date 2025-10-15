/**
 * Service for managing localStorage operations
 * Provides a centralized way to handle auth-related storage
 */

import { UserDetail } from '@/types/api';

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export class StorageService {
  /**
   * Check if we're running in a browser environment
   */
  private static isClientSide(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get auth token from localStorage
   */
  static getAuthToken(): string {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)!;
  }

  /**
   * Set auth token in localStorage
   */
  static setAuthToken(token: string): void {
    if (!this.isClientSide()) return;
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  /**
   * Remove auth token from localStorage
   */
  static removeAuthToken(): void {
    if (!this.isClientSide()) return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Get refresh token from localStorage
   */
  static getRefreshToken(): string | null {
    if (!this.isClientSide()) return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set refresh token in localStorage
   */
  static setRefreshToken(token: string): void {
    if (!this.isClientSide()) return;
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Remove refresh token from localStorage
   */
  static removeRefreshToken(): void {
    if (!this.isClientSide()) return;
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Get user data from localStorage
   */
  static getUser(): UserDetail | null {
    if (!this.isClientSide()) return null;

    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('StorageService: Error parsing stored user data:', error);
      // If parsing fails, remove the corrupted data
      this.removeUser();
      return null;
    }
  }

  /**
   * Set user data in localStorage
   */
  static setUser(user: UserDetail): void {
    if (!this.isClientSide()) return;

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('StorageService: Error storing user data:', error);
    }
  }

  /**
   * Remove user data from localStorage
   */
  static removeUser(): void {
    if (!this.isClientSide()) return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Check if user is stored in localStorage
   */
  static hasStoredAuth(): boolean {
    return !!(this.getAuthToken() && this.getUser());
  }

  /**
   * Get all auth data at once
   */
  static getStoredAuthData(): {
    user: UserDetail | null;
    authToken: string | null;
    refreshToken: string | null;
  } {
    return {
      user: this.getUser(),
      authToken: this.getAuthToken(),
      refreshToken: this.getRefreshToken(),
    };
  }

  /**
   * Set all auth data at once
   */
  static setAuthData(data: {
    user: UserDetail;
    authToken: string;
    refreshToken?: string;
  }): void {
    this.setUser(data.user);
    this.setAuthToken(data.authToken);
    if (data.refreshToken) {
      this.setRefreshToken(data.refreshToken);
    }
  }

  /**
   * Clear all auth data from localStorage
   */
  static clearAuthData(): void {
    this.removeAuthToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  /**
   * Update stored user data (partial update)
   */
  static updateUser(updates: Partial<UserDetail>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
    }
  }
}

export default StorageService;
