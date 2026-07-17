using Tabibi.API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Tabibi.Application.DTOs;
using Tabibi.Application.Interfaces;
using LoginRequest = Tabibi.Application.DTOs.LoginRequest;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace Tabibi.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(
        IAuthService authService,
        ITokenService tokenService) : ControllerBase
    {      

        [EnableRateLimiting("AuthPolicy")]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] SignupRequest signupRequest)
        {
            var res = await authService.Register(signupRequest);
            if (!res.IsSuccess)
                return BadRequest(res.ErrorMessage);

            Response.Cookies.SetRefreshTokenCookie(res.Data!.RefreshToken!);
            Response.Cookies.SetAccessTokenCookie(res.Data!.Token!);

            return Ok(new AuthResponse
            {
                Success = true,
                User = res.Data.User
            });
        }

        [HttpPost("add-to-role")]
        [Authorize]
        public async Task<IActionResult> AddToRole([FromBody] AddToRoleDTO addToRoleDTO)
        {
            // SECURITY: This endpoint only lets a user assign a role to their OWN account
            // (e.g. completing role selection after Google sign-up). It must never accept
            // an arbitrary email, or any authenticated user could grant themselves/others
            // the Doctor role on someone else's account.
            var callerEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");
            if (string.IsNullOrEmpty(callerEmail) || !string.Equals(callerEmail, addToRoleDTO.Email, StringComparison.OrdinalIgnoreCase))
                return Forbid();

            var result = await authService.AddToRole(addToRoleDTO.Email, addToRoleDTO.Role);

            if (!result.IsSuccess)
                return BadRequest(result.ErrorMessage);

            return Created();
        }



        [EnableRateLimiting("AuthPolicy")]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var res = await authService.Login(req);
            if (!res.IsSuccess)
                return NotFound("Invalid Email Or Password");

            Response.Cookies.SetRefreshTokenCookie(res.Data!.RefreshToken!);
            Response.Cookies.SetAccessTokenCookie(res.Data!.Token!);

            return Ok(new AuthResponse 
            { 
                Success = true,
                User = res.Data.User
            });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest req)
        {
            var res = await authService.GoogleLogin(req);
            if (!res.IsSuccess)
                return BadRequest(res.ErrorMessage);

            if (res.Data != null && !res.Data.IsNewUser)
            {
                Response.Cookies.SetRefreshTokenCookie(res.Data.RefreshToken!);
                Response.Cookies.SetAccessTokenCookie(res.Data.Token!);
            }

            return Ok(new AuthResponse
            {
                Success = true,
                User = res.Data?.User,
                IsNewUser = res.Data?.IsNewUser ?? false,
                GoogleName = res.Data?.GoogleName,
                GoogleEmail = res.Data?.GoogleEmail,
                GoogleToken = res.Data?.GoogleToken
            });
        }

        [HttpPost("google-auth-code")]
        public async Task<IActionResult> GoogleAuthCodeExchange([FromBody] GoogleAuthCodeRequest req)
        {
            var res = await authService.GoogleAuthCodeExchange(req);
            if (!res.IsSuccess)
                return BadRequest(res.ErrorMessage);

            if (res.Data != null && !res.Data.IsNewUser)
            {
                Response.Cookies.SetRefreshTokenCookie(res.Data.RefreshToken!);
                Response.Cookies.SetAccessTokenCookie(res.Data.Token!);
            }

            return Ok(new AuthResponse
            {
                Success = true,
                User = res.Data?.User,
                IsNewUser = res.Data?.IsNewUser ?? false,
                GoogleName = res.Data?.GoogleName,
                GoogleEmail = res.Data?.GoogleEmail,
                GoogleToken = res.Data?.GoogleToken,
                Token = res.Data?.Token
            });
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                Request.Cookies.TryGetValue("X-Refresh-Token", out var token);
                Response.Cookies.DeleteRefreshTokenCookie();
                Response.Cookies.DeleteAccessTokenCookie();
                var res = await authService.Logout(token ?? "");
                return Ok("Logged out successfully");
            }
            catch
            {
                return BadRequest("User is not logged in!");
            }
        }


        [HttpPost("refresh-token")]
        public async Task<IActionResult> Refresh()
        {
            Request.Cookies.TryGetValue("X-Refresh-Token", out var currentToken);
            if (string.IsNullOrEmpty(currentToken)) return BadRequest("Invalid Token");

            var result = await tokenService.RefreshTokenAsync(currentToken);
            if (result is null) return Unauthorized("Invalid Token");

            Response.Cookies.SetRefreshTokenCookie(result.NewRefreshToken);
            Response.Cookies.SetAccessTokenCookie(result.JwtToken);

            return Ok();
        }
    }
}