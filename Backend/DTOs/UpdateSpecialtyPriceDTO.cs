namespace Tabibi.DTOs
{
    /// <summary>
    /// DTO for updating custom prices for a specialty's consultation types
    /// </summary>
    public class UpdateSpecialtyPriceDTO
    {
        public int DoctorSpecialtyId { get; set; }

        /// <summary>
        /// Update clinic price (base price)
        /// </summary>
        public decimal? ClinicPrice { get; set; }

        /// <summary>
        /// Custom chat price (max: 40% of clinic price)
        /// Set to null to reset to default
        /// </summary>
        public decimal? ChatPrice { get; set; }

        /// <summary>
        /// Custom video price (max: 60% of clinic price)
        /// Set to null to reset to default
        /// </summary>
        public decimal? VideoPrice { get; set; }

        /// <summary>
        /// Custom call price (max: 60% of clinic price)
        /// Set to null to reset to default
        /// </summary>
        public decimal? CallPrice { get; set; }
    }

    /// <summary>
    /// Response DTO when updating specialty prices
    /// Contains validation results
    /// </summary>
    public class UpdateSpecialtyPriceResponseDTO
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public SpecialtyPriceDTO? UpdatedSpecialty { get; set; }
        public Dictionary<string, string> Errors { get; set; } = new();
    }
}
