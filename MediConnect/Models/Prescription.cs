using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace MediConnect.Models
{
    internal class Prescription
    {
        public class Prescription
        {
            [Key]
            public int PrescriptionId { get; set; }

            public int AppointmentId { get; set; }
            public int DoctorId { get; set; }
            public int PatientId { get; set; }

            [MaxLength(500)]
            public string? Diagnosis { get; set; }

            [MaxLength(2000)]
            public string? Notes { get; set; }

            public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
            public DateTime? ExpiresAt { get; set; }

            [MaxLength(500)]
            public string? PdfUrl { get; set; }   // link to generated PDF

            // Navigation
            [ForeignKey(nameof(AppointmentId))]
            public Appointment Appointment { get; set; } = null!;

            [ForeignKey(nameof(DoctorId))]
            public DoctorProfile Doctor { get; set; } = null!;

            [ForeignKey(nameof(PatientId))]
            public PatientProfile Patient { get; set; } = null!;

            public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
        }
    }
}
