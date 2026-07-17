export interface AdminDoctor {
  doctorId: number;
  userId: string;
  fullName: string;
  email: string;
  licenseNumber: string;
  clinicLocation: string;
  yearsOfExperience: number;
  verificationStatus: "Pending" | "Approved" | "Rejected" | "NeedsChanges";
  adminComment?: string;
  reviewedAt?: string;
  isActive: boolean;
  pendingChangesCount?: number;
  lastChangedAt?: string;
}

export interface AdminDoctorDetail {
  doctorId: number;
  userId: string;
  fullName: string;
  email: string;
  licenseNumber?: string;
  nationalIdNumber?: string;
  clinicLocation?: string;
  clinicPhoneNumber?: string;
  licenseProofUrl?: string;
  idProofUrl?: string;
  degreeProofUrl?: string;
  licenseExpiryDate?: string;
  yearsOfExperience?: number;
  bio?: string;
  verificationStatus: AdminDoctor["verificationStatus"];
  adminComment?: string;
  reviewedAt?: string;
  specialties: { specialtyId: number; name: string }[];
  oldLicenseNumber?: string;
  oldNationalIdNumber?: string;
  oldLicenseProofUrl?: string;
  oldIdProofUrl?: string;
  oldDegreeProofUrl?: string;
  oldLicenseExpiryDate?: string;
  oldSpecialties?: { specialtyId: number; name: string }[];
}

export interface DoctorProfileChangeLog {
  changeLogId: number;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  changedAt: string;
}

export type DoctorDecision = "Approved" | "Rejected" | "NeedsChanges";

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  totalSpent?: number;
}

export interface AdminAppointment {
  appointmentId: number;
  patientName: string;
  doctorName: string;
  scheduledAt: string;
  consultationType: string;
  status: string;
  price: number;
  paymentStatus?: string;
  amountPaid?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface AdminUserQuery {
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: "CreatedAt" | "FullName" | "Email" | "TotalSpent";
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AdminAppointmentQuery {
  search?: string;
  status?: string;
  consultationType?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "ScheduledAt" | "Price" | "Status";
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface AdminUserDetail extends AdminUser {
  appointmentCount: number;
  recentAppointments: AdminAppointment[];
}

export const TABS = ["Overview", "Users", "Doctor Verification", "Appointments & Payments"] as const;
export type Tab = (typeof TABS)[number];
