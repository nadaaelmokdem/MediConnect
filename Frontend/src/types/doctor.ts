import type { DoctorDayAvailability } from "./public";

export type { DoctorDayAvailability };

/**
 * Mock doctor record (frontend-only).
 * `id` maps to backend `doctorId` when integrating the API.
 */
export interface MockDoctor {
  id: number;
  fullName: string;
  specialty: string;
  clinicLocation: string;
  yearsOfExperience: number;
  isVerified: boolean;
  averageRating?: number;
  availability: DoctorDayAvailability[];
}

export interface DoctorListFilter {
  name?: string;
  specialty?: string;
}
