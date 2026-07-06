using Tabibi.DTOs;
using Tabibi.Services;
using Microsoft.AspNetCore.Mvc;
using Tabibi.Shared;
using Microsoft.AspNetCore.Authorization;
using Tabibi.Extensions;
using System.Threading.Tasks;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles=UserRoles.Patient)]
    public class AIController(PatientAIService patientAIService) : ControllerBase
    {
        [HttpGet("quota")]
        public async Task<IActionResult> GetQuota()
        {
            var userId = User.GetId();
            var result = await patientAIService.GetQuotaAsync(userId!);
            
            if (!result.IsSuccess)
                return NotFound(result.ErrorMessage);

            return Ok(result.Data);
        }

        [HttpPost("recharge")]
        public async Task<IActionResult> Recharge([FromBody] RechargeRequest request)
        {
            var userId = User.GetId();
            var result = await patientAIService.RechargeAsync(userId!, request.Amount);

            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok(result.Data);
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskAI(SendAIMessageDTO request)
        {
            var userId = User.GetId();
            var result = await patientAIService.AskAIAsync(userId!, request);

            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Ok(result.Data);
        }

        [HttpGet("history/{sessionId}")]
        public async Task<IActionResult> GetHistory(int sessionId)
        {
            var userId = User.GetId();
            var result = await patientAIService.GetHistoryAsync(userId!, sessionId);

            if (!result.IsSuccess)
                return NotFound(result.ErrorMessage);

            return Ok(result.Data);
        }
    }

    public class RechargeRequest
    {
        public decimal Amount { get; set; }
    }
}
