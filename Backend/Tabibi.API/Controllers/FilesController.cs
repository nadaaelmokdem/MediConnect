using Tabibi.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Tabibi.Application.Services;
using Tabibi.Application.Interfaces;
using Tabibi.Infrastructure.Services;
using Tabibi.Infrastructure.Services.Payments;

namespace Tabibi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }

        [HttpGet("{*objectKey}")]
        public async Task<IActionResult> GetFile(string objectKey)
        {
            if (string.IsNullOrEmpty(objectKey))
            {
                return BadRequest("Object key is required");
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


