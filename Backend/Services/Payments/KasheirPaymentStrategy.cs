using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Tabibi.Models;

namespace Tabibi.Services.Payments
{
    public class KasheirPaymentStrategy : IPaymentGatewayStrategy
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _baseUrl = "https://test-api.kashier.io/v3"; // Change to api.kashier.io for live
        private readonly string _apiKey;
        private readonly string _secretKey;
        private readonly string _merchantId;

        public KasheirPaymentStrategy(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiKey = _configuration["Payment:APIKey"] ?? "";
            _secretKey = _configuration["Payment:SecretKey"] ?? "";
            _merchantId = _configuration["Payment:MerchantId"] ?? "";
        }

        public async Task<string> GeneratePaymentLinkAsync(Payment payment, Appointment appointment)
        {
            var orderId = $"KASH-{payment.PaymentId}-{DateTime.Now.Ticks}";
            payment.ExternalOrderId = orderId;

            var requestBody = new
            {
                amount = payment.Amount.ToString("0.00"),
                currency = "EGP",
                order = orderId,
                merchantId = _merchantId,
                merchantRedirect = _configuration["Payment:ReturnUrl"] ?? "http://localhost:5173/payment-result",
                serverWebhook = _configuration["Payment:WebhookUrl"] ?? "http://localhost:5009/api/Payment/webhook/Kasheir",
                type = "one-time",
                display = "en",
                paymentType = "credit",
                allowedMethods = "card,wallet",
                defaultMethod = "card",
                customer = new 
                {
                    name = appointment.Patient?.User?.FullName ?? "Patient Name",
                    email = appointment.Patient?.User?.Email ?? "patient@example.com",
                    reference = appointment.PatientId.ToString()
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/payment/sessions");
            request.Headers.Add("Authorization", _secretKey);
            request.Headers.Add("api-key", _apiKey);
            request.Content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.SendAsync(request);
                
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    // Read the error message from Kashier's response if possible
                    string errorMessage = $"Status: {response.StatusCode}";
                    try 
                    {
                        using var errorJson = JsonDocument.Parse(responseContent);
                        if (errorJson.RootElement.TryGetProperty("message", out var messageElement))
                        {
                            errorMessage = messageElement.GetString() ?? errorMessage;
                        }
                    }
                    catch { }

                    throw new InvalidOperationException($"Kasheir Payment Gateway Error: {errorMessage}. Payload: {responseContent}");
                }

                using var jsonDocument = JsonDocument.Parse(responseContent);

                // Extract the sessionUrl to redirect the user to Kashier's hosted checkout
                if (jsonDocument.RootElement.TryGetProperty("sessionUrl", out var sessionUrlElement))
                {
                    return sessionUrlElement.GetString() ?? throw new InvalidOperationException("Kasheir response missing sessionUrl");
                }

                throw new InvalidOperationException("Kasheir response did not contain a sessionUrl.");
            }
            catch (HttpRequestException ex)
            {
                throw new InvalidOperationException($"Failed to connect to Kasheir Payment Gateway: {ex.Message}");
            }
        }

        public Task<bool> ValidateWebhookSignatureAsync(string payload, string receivedSignature)
        {
            try
            {
                using var jsonDocument = JsonDocument.Parse(payload);
                var dataElement = jsonDocument.RootElement.GetProperty("data");
                var signatureKeys = dataElement.GetProperty("signatureKeys").EnumerateArray().Select(x => x.GetString()).ToList();

                var pathElements = new List<string>();
                foreach (var key in signatureKeys)
                {
                    // Kashier requires key=value format joined by &
                    var value = dataElement.GetProperty(key).ToString();
                    pathElements.Add($"{key}={Uri.EscapeDataString(value)}");
                }

                var message = string.Join("&", pathElements);

                // Hash the message using HMAC-SHA256
                var keyBytes = Encoding.ASCII.GetBytes(_secretKey);
                var messageBytes = Encoding.ASCII.GetBytes(message);

                using var hmacsha256 = new HMACSHA256(keyBytes);
                var hashMessage = hmacsha256.ComputeHash(messageBytes);
                var computedSignature = BitConverter.ToString(hashMessage).Replace("-", "").ToLower();

                return Task.FromResult(receivedSignature.Equals(computedSignature, StringComparison.OrdinalIgnoreCase));
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public Task<PaymentWebhookResult> ProcessWebhookAsync(string payload)
        {
            try
            {
                using var jsonDocument = JsonDocument.Parse(payload);
                var eventType = jsonDocument.RootElement.GetProperty("event").GetString();
                var dataElement = jsonDocument.RootElement.GetProperty("data");

                var externalOrderId = dataElement.GetProperty("merchantOrderId").GetString();
                var status = dataElement.GetProperty("status").GetString(); // e.g., "SUCCESS"

                var result = new PaymentWebhookResult
                {
                    IsSuccess = true,
                    ExternalOrderId = externalOrderId,
                    NewStatus = status == "SUCCESS" ? PaymentStatus.Paid : PaymentStatus.Failed
                };

                return Task.FromResult(result);
            }
            catch (Exception ex)
            {
                return Task.FromResult(new PaymentWebhookResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Failed to process Kasheir webhook: " + ex.Message
                });
            }
        }
    }
}