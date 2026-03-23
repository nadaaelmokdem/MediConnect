using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace MediConnect.Models
{
    internal class Specialty
    {
        public class Specialty
        {
            [Key]
            public int SpecialtyId { get; set; }

            [Required, MaxLength(100)]
            public string Name { get; set; } = "";

            [MaxLength(500)]
            public string? Description { get; set; }

            [MaxLength(1000)]
            public string? Keywords { get; set; }   // comma-separated, used by AI routing

            [MaxLength(500)]
            public string? IconUrl { get; set; }

            // Navigation
            public ICollection<DoctorSpecialty> DoctorSpecialties { get; set; } = new List<DoctorSpecialty>();
        }
    }
}
