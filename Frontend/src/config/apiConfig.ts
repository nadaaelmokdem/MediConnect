export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5009/api";

/** Force mock data even when the API is reachable */
export const USE_MOCK_DATA =
  import.meta.env.VITE_USE_MOCK_DATA === "true";
