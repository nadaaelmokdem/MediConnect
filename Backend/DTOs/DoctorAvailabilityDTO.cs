namespace Tabibi.DTOs
{
    public class DoctorAvailabilityDTO
    {
        public int AvailabilityId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int SlotDurationMins { get; set; }
        public bool IsActive { get; set; }
    }
}