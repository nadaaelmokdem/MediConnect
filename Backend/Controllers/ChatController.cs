using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Tabibi.Services;
using Tabibi.Shared;
using Tabibi.Extensions;
using System.Threading.Tasks;
using System;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController(ChatService chatService) : ControllerBase
    {
        [HttpPost("start/{doctorId}")]
        [Authorize(Roles = UserRoles.Patient)]
        public async Task<IActionResult> StartSession(int doctorId)
        {
            var userId = User.GetId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            try
            {
                var session = await chatService.StartOrGetSessionAsync(userId, doctorId);
                return Ok(new { sessionId = session.SessionId });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{sessionId}/messages")]
        [Authorize]
        public async Task<IActionResult> GetMessages(int sessionId)
        {
            var userId = User.GetId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var access = await chatService.ValidateAccess(sessionId, userId);
            if (!access.Allowed)
            {
                return Forbid();
            }

            var history = await chatService.GetHistory(sessionId);
            return Ok(history);
        }
        [HttpGet("{sessionId}/details")]
        [Authorize]
        public async Task<IActionResult> GetSessionDetails(int sessionId)
        {
            var userId = User.GetId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var access = await chatService.ValidateAccess(sessionId, userId);
            if (!access.Allowed)
            {
                return Forbid();
            }

            var details = await chatService.GetSessionDetails(sessionId);
            if (details == null) return NotFound();
            
            return Ok(details);
        }
        [HttpGet("sessions")]
        [Authorize]
        public async Task<IActionResult> GetSessions()
        {
            var userId = User.GetId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated.");
            }

            var role = User.IsInRole(UserRoles.Doctor) ? "Doctor" : "Patient";
            var sessions = await chatService.GetUserSessions(userId, role);
            
            return Ok(sessions);
        }
    }
}
