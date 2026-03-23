using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace MediConnect.Models
{
    internal class Appointment
    {
        public class Appointment
        {
            [Key]
            public int AppointmentId { get; set; }

            public int PatientId { get; set; }
            public int DoctorId { get; set; }

            public DateTime ScheduledAt { get; set; }
            public int DurationMins { get; set; } = 30;

            public AppointmentType Type { get; set; } = AppointmentType.Online;
            public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

            [MaxLength(500)]
            public string? ChiefComplaint { get; set; }

            [MaxLength(2000)]
            public string? Notes { get; set; }

            public int? SymptomAnalysisId { get; set; }   // link back to chatbot session

            // Navigation
            [ForeignKey(nameof(PatientId))]
            public PatientProfile Patient { get; set; } = null!;

            [ForeignKey(nameof(DoctorId))]
            public DoctorProfile Doctor { get; set; } = null!;

            [ForeignKey(nameof(SymptomAnalysisId))]
            public SymptomAnalysis? SymptomAnalysis { get; set; }

            public Prescription? Prescription { get; set; }
            public Payment? Payment { get; set; }
            public DoctorReview? Review { get; set; }
        }

        public enum AppointmentType { Online, InPerson }
        public enum AppointmentStatus { Pending, Confirmed, Completed, Cancelled }

    }
}
