import axios from "axios";

const DEFAULT_BASE_URL = "https://localhost:7136/api"

export default axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});