using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Tabibi.Models
{

        public class DoctorSpecialty
        {
            [Key]
            public int Id { get; set; }

            public int DoctorId { get; set; }
            public int SpecialtyId { get; set; }

            public bool IsPrimary { get; set; } = false;

            // Navigation
            [ForeignKey(nameof(DoctorId))]
            public DoctorProfile Doctor { get; set; } = null!;

            [ForeignKey(nameof(SpecialtyId))]
            public Specialty Specialty { get; set; } = null!;
        }
    }
