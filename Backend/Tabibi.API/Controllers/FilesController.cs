using Tabibi.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Tabibi.Application.Services;
using Tabibi.Application.Interfaces;
using Tabibi.Application.Extensions;
using Tabibi.Application.Shared;
using Tabibi.Infrastructure.Services;
using Tabibi.Infrastructure.Services.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Tabibi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IUnitOfWork _unitOfWork;

        public FilesController(IFileService fileService, IUnitOfWork unitOfWork)
        {
            _fileService = fileService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("{*objectKey}")]
        public async Task<IActionResult> GetFile(string objectKey)
        {
            if (string.IsNullOrEmpty(objectKey))
            {
                return BadRequest("Object key is required");
            }

            // SECURITY: identity/verification documents are sensitive — only the owning
            // doctor or an Admin may fetch them, even though the caller is authenticated.
            if (objectKey.StartsWith("proofs/", StringComparison.OrdinalIgnoreCase))
            {
                var userId = User.GetId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                if (!User.IsInRole(UserRoles.Admin))
                {
                    var fileUrl = $"/api/files/{objectKey}";
                    var ownsFile = await _unitOfWork.DoctorProfiles.Query()
                        .AnyAsync(p => p.UserId == userId &&
                            (p.LicenseProofUrl == fileUrl || p.IdProofUrl == fileUrl || p.DegreeProofUrl == fileUrl ||
                             p.OldLicenseProofUrl == fileUrl || p.OldIdProofUrl == fileUrl || p.OldDegreeProofUrl == fileUrl));

                    if (!ownsFile)
                    {
                        return Forbid();
                    }
                }
            }
            else if (objectKey.StartsWith("chats/", StringComparison.OrdinalIgnoreCase))
            {
                // SECURITY: chat attachments may contain private medical information —
                // require the requester to at least be a logged-in user.
                if (string.IsNullOrEmpty(User.GetId()))
                {
                    return Unauthorized();
                }
            }

            try
            {
                var stream = await _fileService.GetFileStreamAsync(objectKey);

                Response.Headers.Append("Cache-Control", "public, max-age=31536000");

                var contentType = GetContentType(objectKey);
                return File(stream, contentType); // Returns FileStreamResult which handles disposal of stream
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error fetching file: " + ex.Message);
            }
        }

        private string GetContentType(string path)
        {
            var ext = System.IO.Path.GetExtension(path).ToLowerInvariant();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".pdf" => "application/pdf",
                _ => "application/octet-stream"
            };
        }
    }
}

