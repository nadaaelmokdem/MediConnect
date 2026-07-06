namespace Tabibi.DTOs
{
    public class ChatSessionDetailsDTO
    {
        public int SessionId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public string DoctorSpecialty { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public string DoctorUserId { get; set; } = string.Empty;
        public string PatientUserId { get; set; } = string.Empty;
    }
}
