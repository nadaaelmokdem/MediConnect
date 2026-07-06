import axios from "axios";
import authService from "./authService";
import { API_BASE_URL } from "../config/apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
  onUnauthorized = handler;
};

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry the refresh-token endpoint itself to avoid infinite loops
    if (originalRequest.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    // If the error is 401
    if (error.response?.status === 401) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Refresh the token (this sets the HTTP-only cookie automatically)
          await authService.refreshToken();

          // Retry the original request with the new cookie
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear user state and redirect to login
          localStorage.removeItem("user");
          if (onUnauthorized) {
            onUnauthorized();
          } else {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        // If it was already retried and still returned 401, redirect to login
        localStorage.removeItem("user");
        if (onUnauthorized) {
          onUnauthorized();
        } else {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
