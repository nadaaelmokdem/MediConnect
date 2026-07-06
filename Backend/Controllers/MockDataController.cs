using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class MockDataController : ControllerBase
    {
        [HttpGet("doctors")]
        public IActionResult GetMockDoctors()
        {
            var mockDoctors = new List<object>
            {
                new { 
                    Id = "doc_1", 
                    Name = "Dr. Ahmed Ali", 
                    Specialty = "Cardiology",
                    Bio = "Experienced cardiologist with 10 years of practice.",
                    ProfilePictureUrl = "https://i.pravatar.cc/150?u=doc_1"
                },
                new { 
                    Id = "doc_2", 
                    Name = "Dr. Sara Mohamed", 
                    Specialty = "Dermatology",
                    Bio = "Expert in skin care and dermatological treatments.",
                    ProfilePictureUrl = "https://i.pravatar.cc/150?u=doc_2"
                },
                new { 
                    Id = "doc_3", 
                    Name = "Dr. Omar Hassan", 
                    Specialty = "Orthopedics",
                    Bio = "Specialist in bone and joint health.",
                    ProfilePictureUrl = "https://i.pravatar.cc/150?u=doc_3"
                }
            };

            return Ok(mockDoctors);
        }

        [HttpGet("slots")]
        public IActionResult GetMockSlots([FromQuery] string doctorId)
        {
            var today = DateTime.UtcNow.Date;
            var mockSlots = new List<object>();

            for (int i = 0; i < 4; i++)
            {
                var currentDate = today.AddDays(i);
                mockSlots.Add(new
                {
                    Date = currentDate.ToString("yyyy-MM-dd"),
                    Slots = new List<object>
                    {
                        new { Id = 1, StartTime = "09:00", EndTime = "09:30", IsAvailable = true },
                        new { Id = 2, StartTime = "09:30", EndTime = "10:00", IsAvailable = false },
                        new { Id = 3, StartTime = "10:00", EndTime = "10:30", IsAvailable = true },
                        new { Id = 4, StartTime = "11:00", EndTime = "11:30", IsAvailable = true }
                    }
                });
            }

            return Ok(mockSlots);
        }
    }
}
