import { API_BASE_URL } from "../config/apiConfig";

export const getFileUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  
  // If it's already an absolute URL, return it
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
    return url;
  }

  // If it starts with /api/, we prepend the domain (without /api since url already has it)
  if (url.startsWith("/api/")) {
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${baseUrl}${url}`;
  }

  // For anything else, return as is (could be a local relative path)
  return url;
};
