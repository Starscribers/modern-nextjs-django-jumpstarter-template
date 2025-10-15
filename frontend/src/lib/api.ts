import axios from 'axios';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: object | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Helpers to detect special payloads we should not transform
const isFormData = (v: object) =>
  typeof FormData !== 'undefined' && v instanceof FormData;
const isURLSearchParams = (v: object) =>
  typeof URLSearchParams !== 'undefined' && v instanceof URLSearchParams;

// Request interceptor for auth tokens and snake_case conversion
apiClient.interceptors.request.use(
  config => {
    // Add auth token if available
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If sending FormData or URLSearchParams, do not convert keys or touch content-type
    if (
      config.data &&
      (isFormData(config.data) || isURLSearchParams(config.data))
    ) {
      // Let the browser set the correct multipart boundary automatically
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
      return config;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling, token refresh, and camelCase conversion
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    // Handle 401 errors (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshToken =
          typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/v1/auth/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;

        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', newAccessToken);
        }

        // Process the queued requests
        processQueue(null, newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as object, null);

        if (typeof window !== 'undefined') {
          console.log('REFRESH FAILED', refreshError);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return a user-friendly error message
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
