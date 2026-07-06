using Tabibi.Models;

namespace Tabibi.DTOs
{
    public class AppointmentBookedDTO
    {
        public int AppointmentId { get; set; }

        public int DoctorId { get; set; }

        public DateTime ScheduledAt { get; set; }

        public ConsultationType ConsultationType { get; set; }

        public AppointmentStatus Status { get; set; }

        public int DurationMins { get; set; }

        public decimal Price { get; set; }

        public string? ChiefComplaint { get; set; }
    }
}
