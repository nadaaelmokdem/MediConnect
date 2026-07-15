using Tabibi.Application.DTOs;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IPaymentService
{
    Task<string> GeneratePaymentLinkAsync(Payment payment, Appointment appointment);
    Task<ServiceResult> ProcessWebhookAsync(PaymentGateway gateway, string payload);
}
