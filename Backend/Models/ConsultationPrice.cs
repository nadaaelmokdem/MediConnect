using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tabibi.Models
{
    public class ConsultationPrice
    {
        [Key]
        public int PriceId { get; set; }

        [Required]
        public int DoctorId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ClinicPrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal ChatPrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal VideoPrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal CallPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey(nameof(DoctorId))]
        public DoctorProfile Doctor { get; set; } = null!;

        public decimal GetPrice(ConsultationType type)
        {
            return type switch
            {
                ConsultationType.Chat => ChatPrice,
                ConsultationType.Video => VideoPrice,
                ConsultationType.Call => CallPrice,
                ConsultationType.Clinic => ClinicPrice,
                _ => 0
            };
        }
    }
}
