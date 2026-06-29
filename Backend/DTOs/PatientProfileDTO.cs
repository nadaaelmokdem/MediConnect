namespace Tabibi.DTOs
{
    public class PatientProfileDTO
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public string? Age { get; set; }
        public string? Gender { get; set; }
        public string? Weight { get; set; }
        public string? Height { get; set; }
        public string? Emergency { get; set; }
        public string? Address { get; set; }

    }
}
