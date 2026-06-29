import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import authService from "../services/authService";
import { type AppUser, type AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(
    () => authService.getUser() || null,
  );
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  // Initialize auth state
  useEffect(() => {
    // Prevent double initialization
    if (initializingRef.current) return;
    initializingRef.current = true;

    const initializeAuth = async () => {
      try {
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(storedUser);
          const accessToken = await authService.refreshToken();

          if (accessToken?.token) {
            setToken(accessToken.token);
          }
        }
      } catch {
        // Only logout if we had a stored user
        const storedUser = authService.getUser();
        if (storedUser) {
          setUser(null);
          setToken(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      if (response.user && response.token) {
        setUser(response.user);
        setToken(response.token);
        return response.user;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      phoneNumber: string,
      userType?: "user" | "doctor",
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.register({
          fullName,
          email,
          password,
          phoneNumber,
          userType,
        });
        if (response.user && response.token) {
          setUser(response.user);
          setToken(response.token);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Sign up failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );


  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      authService.logout();
      setUser(null);
      setToken(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token || !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use the Auth Context
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
