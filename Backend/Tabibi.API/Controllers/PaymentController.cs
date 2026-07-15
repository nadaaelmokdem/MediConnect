using Tabibi.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Tabibi.Core.Models;
using Tabibi.Application.Interfaces;

namespace Tabibi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController(IPaymentService paymentService) : ControllerBase
    {
        [HttpPost("webhook/{gatewayString}")]
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

            var result = await paymentService.ProcessWebhookAsync(gateway, payload);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);

            return Ok();
        }
    }
}
