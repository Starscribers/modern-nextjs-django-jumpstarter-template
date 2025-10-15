import { AuthService } from './authService';
import { userService } from './userService';

// Unified API service that switches between mock and real API
export class ApiService {
  static auth = AuthService;
  static user = userService;
}

export const apiServices = {
  auth: AuthService,
  user: userService,
};

// Default export
export default ApiService;
