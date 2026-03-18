using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace MediConnect.Models
{
    public class ApplicationUser
    {
        public class ApplicationUser : IdentityUser
        {
            [Required, MaxLength(200)]
            public string FullName { get; set; } = "";

            [MaxLength(500)]
            public string? ProfilePictureUrl { get; set; }

            public string? GoogleId { get; set; }

            public bool IsActive { get; set; } = true;

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            // Navigation
            public PatientProfile? PatientProfile { get; set; }
            public DoctorProfile? DoctorProfile { get; set; }
        }
    }
}
