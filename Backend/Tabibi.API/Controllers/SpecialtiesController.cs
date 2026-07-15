using Tabibi.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Tabibi.Application.Services;
using Tabibi.Application.Interfaces;
using Tabibi.Infrastructure.Services;
using Tabibi.Infrastructure.Services.Payments;

namespace Tabibi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialtiesController(IPublicService publicService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetSpecialties()
        {
            var specialties = await publicService.GetSpecialtiesAsync();
            return Ok(specialties);
        }
    }
}



