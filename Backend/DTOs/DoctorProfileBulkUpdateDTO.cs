using System.ComponentModel.DataAnnotations;

namespace Tabibi.DTOs
{
    public class DoctorProfileBulkUpdateDTO
    {
        [Required]
        public string LicenseNumber { get; set; } = "";

        [Required]
        public string NationalIdNumber { get; set; } = "";

        public string ClinicLocation { get; set; } = "";

        public string ClinicPhoneNumber { get; set; } = "";

        public string? LicenseProofUrl { get; set; }
        public string? IdProofUrl { get; set; }
        public string? DegreeProofUrl { get; set; }

        public DateTime? LicenseExpiryDate { get; set; }
        public int YearsOfExperience { get; set; }
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }

        public List<string> Specialties { get; set; } = new List<string>();
    }
}
