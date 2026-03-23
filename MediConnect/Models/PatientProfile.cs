using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace MediConnect.Models
{
    internal class PatientProfile
    {
        public class PatientProfile
        {
            [Key]
            public int PatientId { get; set; }

            [Required]
            public string UserId { get; set; } = "";

            public DateTime? DateOfBirth { get; set; }

            [MaxLength(10)]
            public string? Gender { get; set; }

            [MaxLength(5)]
            public string? BloodType { get; set; }

            [MaxLength(500)]
            public string? Allergies { get; set; }

            [MaxLength(500)]
            public string? ChronicConditions { get; set; }

            [MaxLength(200)]
            public string? EmergencyContact { get; set; }

            public SubscriptionTier SubscriptionTier { get; set; } = SubscriptionTier.Free;

            // Navigation
            [ForeignKey(nameof(UserId))]
            public ApplicationUser User { get; set; } = null!;

            public ICollection<ChatSession> ChatSessions { get; set; } = new List<ChatSession>();
            public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
            public ICollection<DoctorReview> Reviews { get; set; } = new List<DoctorReview>();
        }

        public enum SubscriptionTier { Free, Premium }
    }
}
