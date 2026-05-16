using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Tabibi.Models
{
 
        public class DoctorProfile
        {
            [Key]
            public int DoctorId { get; set; }

            [Required]
            public string UserId { get; set; } = "";

            [MaxLength(100)]
            public string? LicenseNumber { get; set; }

            public int YearsOfExperience { get; set; }

            [Column(TypeName = "decimal(10,2)")]
            public decimal ConsultationFee { get; set; }

            [MaxLength(1000)]
            public string? Bio { get; set; }

            [Column(TypeName = "decimal(3,2)")]
            public decimal AverageRating { get; set; } = 0;

            public bool IsVerified { get; set; } = false;
            public bool IsAvailableNow { get; set; } = false;

            // Navigation
            [ForeignKey(nameof(UserId))]
            public AppUser User { get; set; } = null!;

            public ICollection<DoctorSpecialty> DoctorSpecialties { get; set; } = new List<DoctorSpecialty>();
            public ICollection<DoctorAvailability> Availabilities { get; set; } = new List<DoctorAvailability>();
            public ICollection<DoctorReview> Reviews { get; set; } = new List<DoctorReview>();
            public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        }
    }

