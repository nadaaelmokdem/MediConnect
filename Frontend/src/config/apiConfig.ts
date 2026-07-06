export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5009/api";

/** Set VITE_USE_MOCK_DATA=true in .env to force mock data even when the API is reachable */
export const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === "true";
