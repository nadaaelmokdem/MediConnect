using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tabibi.Core.Models
{
    public class AiRecharge
    {
        [Key]
        public long Id { get; set; }

        public long PatientId { get; set; }

        /// <summary>Amount paid in EGP (must be a multiple of 10).</summary>
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        /// <summary>How many premium AI messages this recharge grants (Amount / 10 * 20).</summary>
        public int MessagesGranted { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
        public PaymentGateway Gateway { get; set; } = PaymentGateway.Geidea;

        [MaxLength(200)]
        public string? GatewayTransactionId { get; set; }

        [MaxLength(200)]
        public string? ExternalOrderId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAt { get; set; }

        // Navigation
        [ForeignKey(nameof(PatientId))]
        public PatientProfile Patient { get; set; } = null!;
    }
}
