namespace Tabibi.DTOs
{

    public class UpdateSpecialtyPriceDTO
    {
        public int DoctorSpecialtyId { get; set; }
        public decimal? ClinicPrice { get; set; }
        public decimal? ChatPrice { get; set; }
        public decimal? VideoPrice { get; set; }
        public decimal? CallPrice { get; set; }
    }

    public class UpdateSpecialtyPriceResponseDTO
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public SpecialtyPriceDTO? UpdatedSpecialty { get; set; }
        public Dictionary<string, string> Errors { get; set; } = new();
    }
}
