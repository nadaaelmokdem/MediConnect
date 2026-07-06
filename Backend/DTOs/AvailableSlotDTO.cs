namespace Tabibi.DTOs
{
    public class AvailableSlotDTO
    {
        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public bool IsAvailable { get; set; }

        public decimal? Price { get; set; }
    }
}
