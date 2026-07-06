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


            [Column(TypeName = "decimal(10,2)")]
            public decimal ClinicPrice { get; set; }
            public bool IsClinicEnabled { get; set; } = true;

            [Column(TypeName = "decimal(10,2)")]
            public decimal ChatPrice { get; set; }
            public bool IsChatEnabled { get; set; } = true;

            [Column(TypeName = "decimal(10,2)")]
            public decimal VideoPrice { get; set; }
            public bool IsVideoEnabled { get; set; } = true;

            [Column(TypeName = "decimal(10,2)")]
            public decimal CallPrice { get; set; }
            public bool IsCallEnabled { get; set; } = true;

            // Navigation
            [ForeignKey(nameof(DoctorId))]
            public DoctorProfile Doctor { get; set; } = null!;

            [ForeignKey(nameof(SpecialtyId))]
            public Specialty Specialty { get; set; } = null!;

        }
    }
