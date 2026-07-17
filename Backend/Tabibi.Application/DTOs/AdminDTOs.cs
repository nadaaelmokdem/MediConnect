using Tabibi.Core.Models;

namespace Tabibi.Application.DTOs
{
    public class AdminDoctorDTO
    {
        public long DoctorId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string ClinicLocation { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public string VerificationStatus { get; set; } = "Pending";
        public string? AdminComment { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public bool IsActive { get; set; }
        public int PendingChangesCount { get; set; }
        public DateTime? LastChangedAt { get; set; }
    }

    public class AdminDoctorDetailDTO
    {
        public long DoctorId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? LicenseNumber { get; set; }
        public string? NationalIdNumber { get; set; }
        public string? ClinicLocation { get; set; }
        public string? ClinicPhoneNumber { get; set; }
        public string? LicenseProofUrl { get; set; }
        public string? IdProofUrl { get; set; }
        public string? DegreeProofUrl { get; set; }
        public DateTime? LicenseExpiryDate { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? Bio { get; set; }
        public string VerificationStatus { get; set; } = "Pending";
        public string? AdminComment { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public List<SpecialtyDTO> Specialties { get; set; } = new();
        public string? OldLicenseNumber { get; set; }
        public string? OldNationalIdNumber { get; set; }
        public string? OldLicenseProofUrl { get; set; }
        public string? OldIdProofUrl { get; set; }
        public string? OldDegreeProofUrl { get; set; }
        public DateTime? OldLicenseExpiryDate { get; set; }
        public List<SpecialtyDTO> OldSpecialties { get; set; } = new();
    }

    public class DoctorProfileChangeLogDTO
    {
        public long ChangeLogId { get; set; }
        public string FieldName { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public DateTime ChangedAt { get; set; }
    }

    public class ReviewDoctorRequestDTO
    {
        public DoctorVerificationStatus Decision { get; set; } = DoctorVerificationStatus.Pending;
        public string? Comment { get; set; }
        public bool RevertToOldData { get; set; } = false;
        public bool BanDoctor { get; set; } = false;
    }

    public class AdminUserDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal? TotalSpent { get; set; }
    }

    public class SetUserActiveRequestDTO
    {
        public bool IsActive { get; set; }
    }

    public class AdminAppointmentDTO
    {
        public long AppointmentId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public DateTime ScheduledAt { get; set; }
        public string ConsultationType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? PaymentStatus { get; set; }
        public decimal? AmountPaid { get; set; }
    }

    public class PagedResultDTO<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }

    public class AdminUserQueryDTO
    {
        public string? Search { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
        public string SortBy { get; set; } = "CreatedAt";
        public bool SortDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class AdminAppointmentQueryDTO
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
        public string? ConsultationType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string SortBy { get; set; } = "ScheduledAt";
        public bool SortDescending { get; set; } = true;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class AdminUserDetailDTO
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public decimal? TotalSpent { get; set; }
        public int AppointmentCount { get; set; }
        public List<AdminAppointmentDTO> RecentAppointments { get; set; } = new();
    }

}
