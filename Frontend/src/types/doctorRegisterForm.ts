export default interface DoctorFormData {
  id: string;
  licenseNumber: string;
  nationalIdNumber: string;
  clinicLocation: string;
  clinicPhoneNumber: string;
  licenseExpiryDate: string;
  yearsOfExperience: string;
  bio: string;
  specialties: string[];
}
