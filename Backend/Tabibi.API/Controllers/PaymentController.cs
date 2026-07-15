using Tabibi.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Tabibi.Core.Models;
using Tabibi.Application.Interfaces;
using Microsoft.AspNetCore.RateLimiting;
using System.IO;
using System.Linq;

namespace Tabibi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController(IPaymentService paymentService) : ControllerBase
    {
        [HttpPost("webhook/{gatewayString}")]
        [EnableRateLimiting("WebhookPolicy")]
        public async Task<IActionResult> Webhook(string gatewayString)
        {
            if (!Enum.TryParse<PaymentGateway>(gatewayString, true, out var gateway))
            {
                return BadRequest("Invalid gateway");
            }

            Request.EnableBuffering();
            Request.Body.Position = 0;
            using var reader = new StreamReader(Request.Body, System.Text.Encoding.UTF8, leaveOpen: true);
            var payload = await reader.ReadToEndAsync();

            // SECURITY: Validate HMAC before touching the database.
            // Geidea embeds signature in the body; header fallback supports future gateways.
            var signatureHeader = Request.Headers["X-Signature"].FirstOrDefault() ?? "";
            if (!await paymentService.ValidateWebhookSignatureAsync(gateway, payload, signatureHeader))
            {
                return Unauthorized("Invalid webhook signature.");
            }

            var result = await paymentService.ProcessWebhookAsync(gateway, payload);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);

            return Ok();
        }
    }
}
