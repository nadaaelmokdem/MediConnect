import axios from './api';
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AppUser,
} from '../types/auth';
import { AxiosError } from 'axios';

const AUTH_API = '/auth';
const TOKEN_KEY = 'mediconnect_token';
const USER_KEY = 'mediconnect_user';

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${AUTH_API}/login`,
        credentials
      );
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
        this.setAuthorizationHeader(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Register a new account
   */
  async register(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${AUTH_API}/register`,
        data
      );
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        if (response.data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        }
        this.setAuthorizationHeader(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${AUTH_API}/forgot-password`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${AUTH_API}/reset-password`,
        data
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh the auth token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        `${AUTH_API}/refresh-token`
      );
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        this.setAuthorizationHeader(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      this.clearAuthData();
      throw this.handleError(error);
    }
  }

  /**
   * Logout - clear local storage and auth header
   */
  logout(): void {
    this.clearAuthData();
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get stored user
   */
  getUser(): AppUser | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Initialize auth state from localStorage and set authorization header
   */
  initializeAuth(): AppUser | null {
    const token = this.getToken();
    if (token) {
      this.setAuthorizationHeader(token);
      return this.getUser();
    }
    return null;
  }

  /**
   * Set authorization header for all requests
   */
  private setAuthorizationHeader(token: string): void {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  /**
   * Clear auth data from localStorage and headers
   */
  private clearAuthData(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  /**
   * Handle and format errors
   */
  private handleError(error: unknown): Error {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'An error occurred';
      return new Error(message);
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }
}

export default new AuthService();
