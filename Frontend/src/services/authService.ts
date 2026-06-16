import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AppUser
} from '../types/auth';
import api from './api';

const AUTH_API = '/auth';

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>(
        `${AUTH_API}/login`,
        credentials,
        { withCredentials: true }
      );
      
      if (response.data.token) {
        this.setAuthorizationHeader(response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      return response.data;
  }

  /**
   * Register a new account
   */
  async register(data: SignupRequest): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>(
        `${AUTH_API}/register`,
        data,
        { withCredentials: true }
      );
      if (response.data.token) {
        this.setAuthorizationHeader(response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>(
        `${AUTH_API}/forgot-password`,
        data,
        { withCredentials: true }
      );
      return response.data;
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
      const response = await api.post<AuthResponse>(
        `${AUTH_API}/reset-password`,
        data,
        { withCredentials: true }
      );
      return response.data;
  }

  /**
   * Refresh the auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        `${AUTH_API}/refresh-token`,
        { withCredentials: true }
      );
      
      if (response.data.token) {
        this.setAuthorizationHeader(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  getUser() : AppUser | undefined
  {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as AppUser;
    } catch (e) {
      console.warn('Failed to parse stored user', e);
      return undefined;
    }
  }

  /**
   * Logout - clear local storage and auth header
   */
  async logout(): Promise<void> {
    this.clearAuthData();
    localStorage.removeItem("user");
    await api.post(`${AUTH_API}/logout`,
        { withCredentials: true });
  }

  /**
   * Set authorization header for all requests
   */
  private setAuthorizationHeader(token: string): void {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Clear auth data from localStorage and headers
   */
  private clearAuthData(): void {
    delete api.defaults.headers.common['Authorization'];
  }

}

export default new AuthService();
