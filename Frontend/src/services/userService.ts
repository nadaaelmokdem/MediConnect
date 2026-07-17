import { isAxiosError } from "axios";
import api from "./api";

export async function addToRole(email: string, role: string) {
  try {
    await api.post("auth/add-to-role", { email: email, role: role });
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new Error("Invalid data provided!");
    }
    throw error;
  }
}
