using System.ComponentModel.DataAnnotations;

namespace Tabibi.DTOs
{
    public class SpecialtyWithPricesDTO
    {
        public string SpecialtyName { get; set; } = "";
        
        [Range(0, 9999999, ErrorMessage = "Price cannot be negative")]
        public decimal ClinicPrice { get; set; }
        public bool IsClinicEnabled { get; set; } = true;

        [Range(0, 9999999, ErrorMessage = "Price cannot be negative")]
        public decimal ChatPrice { get; set; }
        public bool IsChatEnabled { get; set; } = true;

        [Range(0, 9999999, ErrorMessage = "Price cannot be negative")]
        public decimal VideoPrice { get; set; }
        public bool IsVideoEnabled { get; set; } = true;

        [Range(0, 9999999, ErrorMessage = "Price cannot be negative")]
        public decimal CallPrice { get; set; }
        public bool IsCallEnabled { get; set; } = true;
    }
}
