namespace Tabibi.DTOs
{
    public class DoctorAvailabilityUpdateDTO
    {
        public DayOfWeek DayOfWeek { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int SlotDurationMins { get; set; }

        public bool IsActive { get; set; }
    }
}