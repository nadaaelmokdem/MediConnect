using Tabibi.DTOs;
using Tabibi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        [HttpPost("check-email")]
        public async Task<IActionResult> EmailExists([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("User Not Found");
            else
                return Ok();
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            // TODO: Implement token refresh logic
            // 1. Get user from current HttpContext.User claims
            // 2. Find user in database
            // 3. Generate new JWT token
            // 4. Return new token
            // 5. Return 401 if user not found or token invalid

            return Unauthorized(new AuthResponse 
            { 
                Success = false, 
                Message = "Not implemented" 
            });
        }

        private string GenerateJwtToken(AppUser user)
        {
            // TODO: Implement JWT token generation
            // 1. Get JWT settings from configuration
            // 2. Create security key from secret
            // 3. Create signing credentials
            // 4. Create claims (sub, email, name, etc.)
            // 5. Create JwtSecurityToken
            // 6. Write token and return as string
            
            var secret = _configuration["JwtSettings:Secret"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret ?? ""));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("sub", user.Id),
                new Claim("email", user.Email ?? ""),
                new Claim("name", user.FullName)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["JwtSettings:ExpirationMinutes"] ?? "60")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        ///// <summary>
        ///// Helper: Map AppUser to UserResponse DTO
        ///// </summary>
        //private UserResponse MapUserToResponse(AppUser user)
        //{
        //    // TODO: Determine user type (patient/doctor/admin)
        //    var userType = "patient";
        //    if (user.DoctorProfile != null)
        //        userType = "doctor";
        //    // Add admin check if applicable

        //    return new UserResponse
        //    {
        //        Id = user.Id,
        //        Email = user.Email ?? "",
        //        FullName = user.FullName,
        //        ProfilePictureUrl = user.ProfilePictureUrl,
        //        IsActive = user.IsActive,
        //        CreatedAt = user.CreatedAt,
        //        UserType = userType
        //    };
        //}
    }
}
