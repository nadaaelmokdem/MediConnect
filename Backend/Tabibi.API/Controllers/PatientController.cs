using Tabibi.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Tabibi.Application.DTOs;
using Tabibi.Application.Services;
using Tabibi.Application.Interfaces;
using Tabibi.Infrastructure.Services;
using Tabibi.Infrastructure.Services.Payments;
using Tabibi.Application.Extensions;
using Tabibi.Application.Shared;

namespace Tabibi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.Patient)]
    public class PatientController(IPatientService patientService, IFileService fileService) : ControllerBase
    {
        [HttpPut("change-patient-data")]
        public async Task<IActionResult> ChangePatientData(PatientExtraDTO patientData)
        {
            var userId = User.GetId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }
            var res = patientService.ValidatePatientExtras(patientData);
            if (!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }

            if (!(await patientService.UpdateData(userId, patientData)).IsSuccess)
            {
                return NotFound("User not found!");
            }

            return Ok("Data updated successfully");
        }

        [HttpPatch("profile-field")]
        public async Task<IActionResult> UpdateProfileField([FromBody] PatientProfileFieldDTO fieldData)
        {
            var userId = User.GetId();
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            if (string.IsNullOrEmpty(fieldData.FieldName) || string.IsNullOrEmpty(fieldData.Value))
            {
                return BadRequest("Field name and value are required");
            }
            var res = (await patientService.UpdateProfileField(userId, fieldData.FieldName, fieldData.Value));
            if (!res.IsSuccess)
            {
                return BadRequest(res.ErrorMessage);
            }

            return Ok($"{fieldData.FieldName} updated successfully");
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetPatientProfile()
        {
            var userId = User.GetId();

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var profile = await patientService.GetProfile(userId);

            if (profile is not null)
            {
                return Ok(profile);
            }
            return NotFound("User does not exist!");
        }
    
        [HttpGet("dashboard-summary")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = User.GetId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }
 
            var dashboard = await patientService.GetDashboard(userId);
            if (dashboard is null)
            {
                return NotFound("User does not exist!");
            }
 
            return Ok(dashboard);
        }
 
        [HttpPost("upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            var userId = User.GetId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");

            var validation = FileValidationHelper.ValidateImage(file);
            if (!validation.IsSuccess)
                return BadRequest(validation.ErrorMessage);

            var fileUrl = await fileService.UploadFileAsync(file, "avatars");

            var res = await patientService.UpdateProfileField(userId, "profilePictureUrl", fileUrl);
            if (!res.IsSuccess)
                return BadRequest(res.ErrorMessage);

            return Ok(new { url = fileUrl });
        }
    }
}




