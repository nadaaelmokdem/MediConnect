export interface DoctorSearchFilter {
  name?: string;
  specialtyId?: number;
  minPrice?: number;
  maxPrice?: number;
  bookingTypes?: number[]; // ConsultationType enum
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DoctorListSpecialty {
  specialtyId: number;
  name: string;
  clinicPrice: number;
  chatPrice: number;
  videoPrice: number;
  callPrice: number;
}

export interface DoctorListItem {
  doctorId: number;
  fullName: string;
  profilePictureUrl?: string;
  averageRating: number;
  yearsOfExperience?: number;
  clinicLocation?: string;
  bio?: string;
  specialties: DoctorListSpecialty[];
}
