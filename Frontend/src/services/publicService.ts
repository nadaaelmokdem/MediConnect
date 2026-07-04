import api from "./api";
import type { DoctorSearchFilter, PaginatedResult, DoctorListItem } from "../types/public";

export default class PublicService {
  static async getDoctors(filter: DoctorSearchFilter): Promise<PaginatedResult<DoctorListItem>> {
    try {
      const response = await api.get("public/doctors", {
        params: filter
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
      throw new Error("Failed to fetch doctors.");
    }
  }

  static async getSpecialties(): Promise<{ specialtyId: number; name: string }[]> {
    try {
      const response = await api.get("specialties");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch specialties:", error);
      return [];
    }
  }
}
