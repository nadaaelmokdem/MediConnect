using MediConnectAPI.DTOs;
using MediConnectAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MediConnectAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIController(AIDoctor aiDoctor) : ControllerBase
    {
        [HttpPost()]
        public async Task<IActionResult> AskAI(SendAIMessageDTO request)
        {
            return Ok(await aiDoctor.Ask(request.RequestText, request.ContextText));
        }
    }
}
