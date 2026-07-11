using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.Models;
using Tabibi.Services.Payments;

namespace Tabibi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController(
        AppDbContext dbContext,
        PaymentGatewayResolver paymentGatewayResolver) : ControllerBase
    {
        [HttpPost("webhook/{gatewayString}")]
        public async Task<IActionResult> Webhook(string gatewayString)
        {
            if (!Enum.TryParse<PaymentGateway>(gatewayString, true, out var gateway))
            {
                return BadRequest("Invalid gateway");
            }

            using var reader = new StreamReader(Request.Body);
            var payload = await reader.ReadToEndAsync();
            var signature = Request.Headers["x-kashier-signature"].ToString();

            var strategy = paymentGatewayResolver.Resolve(gateway);

            // 1. Validate Signature
            var isValid = await strategy.ValidateWebhookSignatureAsync(payload, signature);
            if (!isValid) return Unauthorized("Invalid signature");

            // 2. Process Payload
            var result = await strategy.ProcessWebhookAsync(payload);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);

            // 3. Update Database
            var payment = await dbContext.Payments
                .Include(p => p.Appointment)
                .FirstOrDefaultAsync(p => p.ExternalOrderId == result.ExternalOrderId);

            if (payment == null) return NotFound("Payment not found");

            payment.Status = result.NewStatus;
            
            if (result.NewStatus == PaymentStatus.Paid)
            {
                payment.PaidAt = DateTime.Now;
            }

            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
