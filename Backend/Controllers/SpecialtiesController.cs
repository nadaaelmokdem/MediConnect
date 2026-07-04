using Microsoft.AspNetCore.Mvc;
using Tabibi.Services;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialtiesController(PublicService publicService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetSpecialties()
        {
            var specialties = await publicService.GetSpecialtiesAsync();
            return Ok(specialties);
        }
    }
}
