using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tabibi.Data;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecialtiesController(AppDbContext dbContext) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetSpecialties()
        {
            var specialties = await dbContext.Specialties
                .OrderBy(s => s.Name)
                .Select(s => new
                {
                    s.SpecialtyId,
                    s.Name
                })
                .ToListAsync();

            return Ok(specialties);
        }
    }
}
