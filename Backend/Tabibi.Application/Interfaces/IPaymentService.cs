using Tabibi.Application.DTOs;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IPaymentService
{
    Task<string> GeneratePaymentLinkAsync(Payment payment, Appointment appointment);
    Task<string> GenerateRechargePaymentLinkAsync(AiRecharge recharge, string patientEmail, string patientPhone, string patientName);
    Task<string> GenerateFollowUpPaymentLinkAsync(Payment payment, ChatSession session, string patientEmail, string patientPhone, string patientName);
    Task<bool> ValidateWebhookSignatureAsync(PaymentGateway gateway, string payload, string signature);
    Task<ServiceResult> ProcessWebhookAsync(PaymentGateway gateway, string payload);
}
