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

        /// <summary>
        /// Base clinic price set by the doctor (in-person consultation)
        /// </summary>
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal ClinicPrice { get; set; }

        /// <summary>
        /// Calculated: 40% of ClinicPrice
        /// </summary>
        [Column(TypeName = "decimal(10,2)")]
        public decimal ChatPrice { get; set; }

        /// <summary>
        /// Calculated: 60% of ClinicPrice
        /// </summary>
        [Column(TypeName = "decimal(10,2)")]
        public decimal VideoPrice { get; set; }

        /// <summary>
        /// Calculated: 60% of ClinicPrice
        /// </summary>
        [Column(TypeName = "decimal(10,2)")]
        public decimal CallPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey(nameof(DoctorId))]
        public DoctorProfile Doctor { get; set; } = null!;

        /// <summary>
        /// Calculates all prices based on clinic price
        /// </summary>
        public void CalculatePrices()
        {
            ChatPrice = Math.Round(ClinicPrice * 0.4m, 2);  // 40% of clinic price
            VideoPrice = Math.Round(ClinicPrice * 0.6m, 2); // 60% of clinic price
            CallPrice = Math.Round(ClinicPrice * 0.6m, 2);  // 60% of clinic price
            UpdatedAt = DateTime.UtcNow;
        }

        /// <summary>
        /// Get price for specific consultation type
        /// </summary>
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
