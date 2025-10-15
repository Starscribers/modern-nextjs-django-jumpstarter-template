// API-specific types for the Modern Django Template

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Authentication
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: UserResponse;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

// User
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateJoined: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface UserDetail {
  id: string;
  email: string;
  name: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive?: boolean;
  dateJoined?: string;
  lastLogin?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// File Upload
export interface FileUploadResponse {
  id: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
  createdAt: string;
}

// Example entity types - customize for your domain

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  author: UserResponse;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  isPublished?: boolean;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  isPublished?: boolean;
}

export interface CommentResponse {
  id: number;
  content: string;
  author: UserResponse;
  postId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
}
