using System.ComponentModel.DataAnnotations;
using Tabibi.Models;

namespace Tabibi.DTOs
{
    public class BookAppointmentDTO
    {
        [Required]
        public int DoctorId { get; set; }

        [Required]
        public DateTime ScheduledAt { get; set; }

        [Required]
        public ConsultationType Type { get; set; }

        [MaxLength(500)]
        public string? ChiefComplaint { get; set; }
    }
}
