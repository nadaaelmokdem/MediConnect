import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:5009/api"

export default axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});