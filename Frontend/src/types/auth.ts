// Auth-related type definitions

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  isActive: boolean;
  createdAt: string;
  userType?: 'patient' | 'doctor' | 'admin';
}

export interface AuthContextType {
  user: AppUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, userType?: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  userType?: 'patient' | 'doctor';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AppUser;
  token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
