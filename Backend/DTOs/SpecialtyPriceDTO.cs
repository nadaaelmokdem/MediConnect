namespace Tabibi.DTOs
{
    /// <summary>
    /// DTO for doctor specialty with custom pricing information
    /// Includes ceiling limits and customization flags
    /// </summary>
    public class SpecialtyPriceDTO
    {
        public int DoctorSpecialtyId { get; set; }
        public int SpecialtyId { get; set; }
        public string SpecialtyName { get; set; } = "";
        public string? SpecialtyDescription { get; set; }
        public string? SpecialtyIconUrl { get; set; }
        public bool IsPrimary { get; set; }

        // Current Pricing
        public decimal ClinicPrice { get; set; }
        public decimal ChatPrice { get; set; }
        public decimal VideoPrice { get; set; }
        public decimal CallPrice { get; set; }

        // Custom Pricing Flags
        public bool IsCustomChatPrice { get; set; }
        public bool IsCustomVideoPrice { get; set; }
        public bool IsCustomCallPrice { get; set; }

        // Maximum Allowed Prices (Ceilings)
        public decimal MaxChatPrice { get; set; }
        public decimal MaxVideoPrice { get; set; }
        public decimal MaxCallPrice { get; set; }

        // Default Percentages (for reference)
        public decimal ChatPercentage { get; set; } // 0.4 (40%)
        public decimal VideoPercentage { get; set; } // 0.6 (60%)
        public decimal CallPercentage { get; set; } // 0.6 (60%)

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

