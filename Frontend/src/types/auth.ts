// Auth-related type definitions

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  profilePictureUrl?: string;
  isActive: boolean;
  createdAt: string;
  roles?: string[];
  activeRole?: string;
  isVerified?: boolean;
}

export interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, requiredRole?: string) => Promise<AppUser | undefined>;
  switchRole: (role: string) => void;
  googleLogin: (token: string, requiredRole?: string) => Promise<AuthResponse>;
  register: (
    fullName: string,
    email: string,
    password: string | undefined,
    phoneNumber: string,
    role?: "user" | "doctor",
    googleToken?: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (patch: Partial<AppUser>) => void;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: "user" | "doctor";
  googleToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AppUser;
  isNewUser?: boolean;
  googleName?: string;
  googleEmail?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
