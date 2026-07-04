namespace Tabibi.DTOs
{

    public class SpecialtyPriceDTO
    {
        public string SpecialtyName { get; set; } = "";
        public decimal ClinicPrice { get; set; }
        public decimal ChatPrice { get; set; }
        public decimal VideoPrice { get; set; }
        public decimal CallPrice { get; set; }
        public bool IsClinicEnabled { get; set; } = true;
        public bool IsChatEnabled { get; set; } = true;
        public bool IsVideoEnabled { get; set; } = true;
        public bool IsCallEnabled { get; set; } = true;
    }
}

