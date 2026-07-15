using Tabibi.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Tabibi.API.Hubs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Tabibi.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoCallController(IHubContext<VideoCallHub> hubContext, Tabibi.Application.Interfaces.IChatService chatService) : ControllerBase
    {
        [HttpPost("leave-beacon/{sessionId}")]
        [Authorize]
        public async Task<IActionResult> LeaveBeacon(string sessionId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            if (!long.TryParse(sessionId, out var parsedSessionId))
            {
                return BadRequest("Invalid session format.");
            }

            var access = await chatService.ValidateVideoCallAccess(parsedSessionId, userId);
            if (!access.Allowed)
            {
                return Forbid();
            }

            // Using SendAsync to broadcast to the group directly from the controller
            // The remaining peer will receive "UserLeftFallback" and reconnect
            await hubContext.Clients.Group(sessionId).SendAsync("UserLeftFallback", userId);

            if (VideoCallHub.CallStarted.TryRemove(parsedSessionId, out _))
            {
                await chatService.CompleteVideoCallSessionAsync(parsedSessionId);
            }

            return Ok();
        }
    }
}


