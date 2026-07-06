import type { DoctorListItem, DoctorListSpecialty, PaginatedResult } from "../types/public";

function read<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key] as T;
    }
  }
  return undefined;
}

function normalizeSpecialty(raw: Record<string, unknown>): DoctorListSpecialty {
  return {
    specialtyId: read<number>(raw, "specialtyId", "SpecialtyId") ?? 0,
    name: read<string>(raw, "name", "Name") ?? "",
    clinicPrice: read<number>(raw, "clinicPrice", "ClinicPrice") ?? 0,
    chatPrice: read<number>(raw, "chatPrice", "ChatPrice") ?? 0,
    videoPrice: read<number>(raw, "videoPrice", "VideoPrice") ?? 0,
    callPrice: read<number>(raw, "callPrice", "CallPrice") ?? 0,
  };
}

export function normalizeDoctorListItem(raw: Record<string, unknown>): DoctorListItem {
  const specialtiesRaw =
    read<Record<string, unknown>[]>(raw, "specialties", "Specialties") ?? [];

  return {
    doctorId: read<number>(raw, "doctorId", "DoctorId") ?? 0,
    fullName: read<string>(raw, "fullName", "FullName") ?? "",
    profilePictureUrl: read<string>(raw, "profilePictureUrl", "ProfilePictureUrl"),
    averageRating: read<number>(raw, "averageRating", "AverageRating") ?? 0,
    yearsOfExperience: read<number>(raw, "yearsOfExperience", "YearsOfExperience"),
    clinicLocation: read<string>(raw, "clinicLocation", "ClinicLocation"),
    bio: read<string>(raw, "bio", "Bio"),
    isAvailableNow: read<boolean>(raw, "isAvailableNow", "IsAvailableNow"),
    specialties: specialtiesRaw.map((s) => normalizeSpecialty(s)),
  };
}

export function normalizePaginatedDoctors(
  data: Record<string, unknown>,
): PaginatedResult<DoctorListItem> {
  const itemsRaw = read<Record<string, unknown>[]>(data, "items", "Items") ?? [];

  return {
    items: itemsRaw.map((item) => normalizeDoctorListItem(item)),
    totalCount: read<number>(data, "totalCount", "TotalCount") ?? itemsRaw.length,
    page: read<number>(data, "page", "Page") ?? 1,
    pageSize: read<number>(data, "pageSize", "PageSize") ?? 10,
    totalPages: read<number>(data, "totalPages", "TotalPages") ?? 1,
  };
}

export function normalizeSpecialties(
  data: unknown,
): { specialtyId: number; name: string }[] {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const raw = item as Record<string, unknown>;
    return {
      specialtyId: read<number>(raw, "specialtyId", "SpecialtyId") ?? 0,
      name: read<string>(raw, "name", "Name") ?? "",
    };
  });
}
