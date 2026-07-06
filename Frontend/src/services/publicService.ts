import api from "./api";
import { USE_MOCK_DATA } from "../config/apiConfig";
import {
  MOCK_DOCTORS,
  filterMockDoctors,
  MOCK_SPECIALTY_NAMES,
} from "../data/mockDoctors";
import type { DoctorSearchFilter, PaginatedResult, DoctorListItem } from "../types/public";
import { normalizePaginatedDoctors, normalizeSpecialties } from "../utils/apiHelpers";

function mockPaginatedResult(
  filter: DoctorSearchFilter,
): PaginatedResult<DoctorListItem> {
  const items = filterMockDoctors({
    name: filter.name,
    specialty: filter.specialtyId
      ? MOCK_SPECIALTY_NAMES[filter.specialtyId - 1]
      : undefined,
  });

  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 10;
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalCount,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export default class PublicService {
  static async getDoctors(
    filter: DoctorSearchFilter,
  ): Promise<PaginatedResult<DoctorListItem>> {
    if (USE_MOCK_DATA) {
      return mockPaginatedResult(filter);
    }

    try {
      const response = await api.get("public/doctors", { params: filter });
      const payload = response.data?.data ?? response.data;
      const normalized = normalizePaginatedDoctors(payload);
      if (normalized.items.length === 0) {
        return mockPaginatedResult(filter);
      }
      return normalized;
    } catch (error) {
      console.warn("Doctors API unavailable — using mock data.", error);
      return mockPaginatedResult(filter);
    }
  }

  static async getSpecialties(): Promise<{ specialtyId: number; name: string }[]> {
    if (USE_MOCK_DATA) {
      return MOCK_SPECIALTY_NAMES.map((name, i) => ({
        specialtyId: i + 1,
        name,
      }));
    }

    try {
      const response = await api.get("specialties");
      const payload = response.data?.data ?? response.data;
      const normalized = normalizeSpecialties(payload);
      if (normalized.length > 0) return normalized;
      return MOCK_SPECIALTY_NAMES.map((name, i) => ({
        specialtyId: i + 1,
        name,
      }));
    } catch (error) {
      console.warn("Specialties API unavailable — using mock data.", error);
      return MOCK_SPECIALTY_NAMES.map((name, i) => ({
        specialtyId: i + 1,
        name,
      }));
    }
  }
}

export { MOCK_DOCTORS };
