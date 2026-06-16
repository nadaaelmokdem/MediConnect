namespace Tabibi.DTOs
{
    public class PatientExtraDTO
    {
        public required string Id { get; set; }
        public string? Address { get; set; }
        public string? Age { get; set; }
        public string? Gender { get; set; }
        public string? Weight { get; set; }
        public string? Height { get; set; }
        public string? EmergencyContact { get; set; }

    }
}
