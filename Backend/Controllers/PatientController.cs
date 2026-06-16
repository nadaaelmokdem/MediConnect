using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.SqlServer.Server;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Services;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController(PatientService patientService) : ControllerBase
    {
        [HttpPatch("change-patient-data")]
        public async Task<IActionResult> ChangePatientData(PatientExtraDTO patientData)
        {
            if (!patientService.ValidatePatientExtras(patientData))
            {
                return BadRequest("Please check that your data is valid!");
            }

            if (!await patientService.UpdateData(patientData))
            {
                return NotFound("User not found!");
            }

            return Ok("Data updated successfully");
        }
        
    }
}
