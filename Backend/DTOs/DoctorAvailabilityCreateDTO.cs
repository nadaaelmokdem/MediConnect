namespace Tabibi.DTOs
{
    public class DoctorAvailabilityCreateDTO
    {
        public DayOfWeek DayOfWeek { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public int SlotDurationMins { get; set; } = 30;
    }
}