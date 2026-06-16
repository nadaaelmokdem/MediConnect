using Azure.Core;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Models;
using Tabibi.Services;
using LoginRequest = Tabibi.DTOs.LoginRequest;

namespace Tabibi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        SignInManager<AppUser> signInManager,
        UserManager<AppUser> userManager,
        IConnectionMultiplexer redis,
        AuthUtils authUtils) : ControllerBase
    {        private readonly IDatabase _cache = redis.GetDatabase();

        [HttpPost("check-email")]
        public async Task<IActionResult> EmailExists([FromBody] string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("User Not Found");
            else
                return Ok();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] SignupRequest signupRequest)
        {
            var user = new AppUser
            {
                UserName = signupRequest.Email,
                FullName = signupRequest.FullName,
                Email = signupRequest.Email,
                EmailConfirmed = false,
                PhoneNumber = signupRequest.PhoneNumber,
                PhoneNumberConfirmed = false,
                PatientProfile = new()
            };

            var res = await userManager.CreateAsync(user, signupRequest.Password);
            var refreshToken = authUtils.GenerateRefreshToken();

            string redisKey = $"refresh-token:{refreshToken}";
            TimeSpan tokenLifetime = TimeSpan.FromDays(7);
            await _cache.StringSetAsync(redisKey, user.Id, tokenLifetime);
            authUtils.SetRefreshTokenCookie(refreshToken);

            if (res.Succeeded)
                return Ok(new
                {
                    user = authUtils.MapUserToResponse(user),
                    token = authUtils.GenerateJwtToken(user)
                });
            else
                return BadRequest(res.Errors);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var user = await userManager.FindByEmailAsync(req.Email);
            if (user is null)
                return NotFound("Invalid Email Or Password");
            var res = await signInManager.CheckPasswordSignInAsync(user, req.Password,true);
            if (res.Succeeded)
            {
                var refreshToken = authUtils.GenerateRefreshToken();
                string redisKey = $"refresh-token:{refreshToken}";
                TimeSpan tokenLifetime = TimeSpan.FromDays(7);
                await _cache.StringSetAsync(redisKey, user.Id, tokenLifetime);
                authUtils.SetRefreshTokenCookie(refreshToken);

                return Ok(new
                {
                    user = authUtils.MapUserToResponse(user),
                    token = authUtils.GenerateJwtToken(user)
                });
            }
            return NotFound("Invalid Email Or Password");
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,             
                SameSite = SameSiteMode.Lax,     
                Expires = DateTime.UtcNow.AddDays(-1) // Forces the browser to delete it immediately
            };
            Request.Cookies.TryGetValue("X-Refresh-Token", out var token);
            await _cache.KeyDeleteAsync($"refresh-token:{token}");
            Response.Cookies.Append("X-Refresh-Token", "", cookieOptions);

            return Ok(new { message = "Logged out successfully" });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> Refresh()
        {
            var currentToken = authUtils.GetRefreshToken();
            if (string.IsNullOrEmpty(currentToken)) return BadRequest("Invalid Token");

            var result = await authUtils.RefreshTokenAsync(currentToken);
            if (result is null) return BadRequest("Invalid Token");

            authUtils.SetRefreshTokenCookie(result.NewRefreshToken);
            return Ok(new { token = result.JwtToken });
        }
    }
}
