using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Tabibi.DTOs;
using Tabibi.Services;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class PublicController(PublicService publicService) : ControllerBase
    {
        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctors([FromQuery] DoctorSearchFilterDTO filter)
        {
            if (filter.Page < 1) filter.Page = 1;
            if (filter.PageSize < 1 || filter.PageSize > 50) filter.PageSize = 10;

            var result = await publicService.GetDoctorsAsync(filter);
            return Ok(result);
        }
    }
}
