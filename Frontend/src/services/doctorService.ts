import { isAxiosError } from "axios";
import api from "./api";
import type { DoctorProfileData } from "../types/profilePageProps";

export default class DoctorService {
  static async updateProfileField(
    fieldName: string,
    value: string,
  ): Promise<boolean> {
    try {
      await api.patch(
        "doctor/profile-field",
        { fieldName, value },
        { withCredentials: true },
      );

      return true;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 404) {
          throw new Error("User not found!");
        } else if (error.response.status === 400) {
          throw new Error("Invalid data provided!");
        }
      }

      console.error("An unexpected error occurred:", error);
      throw new Error("An unexpected error occurred.");
    }
  }

  static async getProfile(): Promise<DoctorProfileData> {
    const response = await api.get("doctor/profile");
    return response.data;
  }
}
