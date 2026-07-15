using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Services.Payments
{
    public interface IPaymentGatewayStrategy
    {
        Task<string> GeneratePaymentLinkAsync(Payment payment, Appointment appointment);
        Task<string> GenerateRechargePaymentLinkAsync(AiRecharge recharge, string patientEmail, string patientPhone, string patientName);
        Task<string> GenerateFollowUpPaymentLinkAsync(Payment payment, ChatSession session, string patientEmail, string patientPhone, string patientName);
        Task<bool> ValidateWebhookSignatureAsync(string payload, string signature);
        Task<PaymentWebhookResult> ProcessWebhookAsync(string payload);
    }

    public class PaymentWebhookResult
    {
        public bool IsSuccess { get; set; }
        public string? ExternalOrderId { get; set; }
        public PaymentStatus NewStatus { get; set; }
        public string? ErrorMessage { get; set; }
        public decimal Amount { get; set; }
        public string? Currency { get; set; }
    }
}


