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

            /// <summary>
            /// Base clinic price for this specialty (in-person consultation)
            /// </summary>
            [Required]
            [Column(TypeName = "decimal(10,2)")]
            public decimal ClinicPrice { get; set; }

            /// <summary>
            /// Chat consultation price for this specialty (max ceiling: 40% of clinic price)
            /// </summary>
            [Column(TypeName = "decimal(10,2)")]
            public decimal ChatPrice { get; set; }

            /// <summary>
            /// Video consultation price for this specialty (max ceiling: 60% of clinic price)
            /// </summary>
            [Column(TypeName = "decimal(10,2)")]
            public decimal VideoPrice { get; set; }

            /// <summary>
            /// Phone call consultation price for this specialty (max ceiling: 60% of clinic price)
            /// </summary>
            [Column(TypeName = "decimal(10,2)")]
            public decimal CallPrice { get; set; }

            /// <summary>
            /// Tracks if chat price is customized (doctor set it manually)
            /// </summary>
            public bool IsCustomChatPrice { get; set; } = false;

            /// <summary>
            /// Tracks if video price is customized (doctor set it manually)
            /// </summary>
            public bool IsCustomVideoPrice { get; set; } = false;

            /// <summary>
            /// Tracks if call price is customized (doctor set it manually)
            /// </summary>
            public bool IsCustomCallPrice { get; set; } = false;

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

            // Navigation
            [ForeignKey(nameof(DoctorId))]
            public DoctorProfile Doctor { get; set; } = null!;

            [ForeignKey(nameof(SpecialtyId))]
            public Specialty Specialty { get; set; } = null!;

            /// <summary>
            /// Get the percentage for each consultation type
            /// </summary>
            public static decimal GetDefaultPercentage(ConsultationType type)
            {
                return type switch
                {
                    ConsultationType.Chat => 0.4m,  // 40%
                    ConsultationType.Video => 0.6m, // 60%
                    ConsultationType.Call => 0.6m,  // 60%
                    _ => 0m
                };
            }

            /// <summary>
            /// Get the maximum allowed price (ceiling) for a consultation type
            /// Ceiling is the default percentage applied to clinic price
            /// </summary>
            public decimal GetMaxPriceForType(ConsultationType type)
            {
                return Math.Round(ClinicPrice * GetDefaultPercentage(type), 2);
            }

            /// <summary>
            /// Calculates all prices based on clinic price (resets to defaults)
            /// </summary>
            public void CalculatePrices()
            {
                ChatPrice = Math.Round(ClinicPrice * 0.4m, 2);  // 40% of clinic price
                VideoPrice = Math.Round(ClinicPrice * 0.6m, 2); // 60% of clinic price
                CallPrice = Math.Round(ClinicPrice * 0.6m, 2);  // 60% of clinic price
                
                // Reset custom flags
                IsCustomChatPrice = false;
                IsCustomVideoPrice = false;
                IsCustomCallPrice = false;
                
                UpdatedAt = DateTime.UtcNow;
            }

            /// <summary>
            /// Set a custom price for a consultation type
            /// Price must not exceed the ceiling (default percentage)
            /// </summary>
            public bool TrySetCustomPrice(ConsultationType type, decimal customPrice)
            {
                decimal maxPrice = GetMaxPriceForType(type);

                if (customPrice < 0)
                    return false; // Price cannot be negative

                if (customPrice > maxPrice)
                    return false; // Price exceeds ceiling

                switch (type)
                {
                    case ConsultationType.Chat:
                        ChatPrice = Math.Round(customPrice, 2);
                        IsCustomChatPrice = true;
                        break;
                    case ConsultationType.Video:
                        VideoPrice = Math.Round(customPrice, 2);
                        IsCustomVideoPrice = true;
                        break;
                    case ConsultationType.Call:
                        CallPrice = Math.Round(customPrice, 2);
                        IsCustomCallPrice = true;
                        break;
                    default:
                        return false;
                }

                UpdatedAt = DateTime.UtcNow;
                return true;
            }

            /// <summary>
            /// Get the default (calculated) price for a consultation type
            /// </summary>
            public decimal GetDefaultPriceForType(ConsultationType type)
            {
                return type switch
                {
                    ConsultationType.Clinic => ClinicPrice,
                    ConsultationType.Video => Math.Round(ClinicPrice * 0.6m, 2),
                    ConsultationType.Call => Math.Round(ClinicPrice * 0.6m, 2),
                    ConsultationType.Chat => Math.Round(ClinicPrice * 0.4m, 2),
                    _ => ClinicPrice
                };
            }

            /// <summary>
            /// Get price for specific consultation type
            /// </summary>
            public decimal GetPriceByType(ConsultationType type)
            {
                return type switch
                {
                    ConsultationType.Clinic => ClinicPrice,
                    ConsultationType.Video => VideoPrice,
                    ConsultationType.Call => CallPrice,
                    ConsultationType.Chat => ChatPrice,
                    _ => ClinicPrice
                };
            }
        }
    }
