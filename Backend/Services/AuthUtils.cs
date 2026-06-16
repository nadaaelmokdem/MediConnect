using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Tabibi.DTOs;
using Tabibi.Models;

namespace Tabibi.Services
{
    public class AuthUtils(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ITokenStore _tokenStore, UserManager<AppUser> _userManager)
    {
        public record TokenRefreshResult(string NewRefreshToken, string JwtToken);

        public void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            httpContextAccessor.HttpContext?.Response.Cookies.Append("X-Refresh-Token", refreshToken, cookieOptions);
        }

        public string? GetRefreshToken()
        {
            httpContextAccessor.HttpContext!.Request.Cookies.TryGetValue("X-Refresh-Token", out var token);
            return token;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public string GenerateJwtToken(AppUser user)
        {
            var secret = configuration["JwtSettings:Secret"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret ?? ""));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim("sub", user.Id),
                new Claim("email", user.Email ?? ""),
                new Claim("name", user.FullName!),
                new Claim("phone", user.PhoneNumber ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: configuration["JwtSettings:Issuer"],
                audience: configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(configuration["JwtSettings:ExpirationMinutes"] ?? "60")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public UserResponse MapUserToResponse(AppUser user)
        {
            var userType = "patient";
            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email ?? "",
                FullName = user.FullName!,
                PhoneNumber = user.PhoneNumber!,
                ProfilePictureUrl = user.ProfilePictureUrl,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                UserType = userType
            };
        }

        public async Task<TokenRefreshResult?> RefreshTokenAsync(string oldRefreshToken)
        {
            TimeSpan tokenLifetime = TimeSpan.FromDays(7);
            TimeSpan gracePeriod = TimeSpan.FromSeconds(30);
            TimeSpan lockTimeout = TimeSpan.FromSeconds(5);

            var activeReplacement = await _tokenStore.GetActiveReplacementAsync(oldRefreshToken);
            if (activeReplacement is not null)
            {
                var existingUserId = await _tokenStore.GetUserIdByTokenAsync(activeReplacement);
                return existingUserId is not null ? await GenerateResultAsync(existingUserId, activeReplacement) : null;
            }

            string lockKey = $"lock:refresh-token:{oldRefreshToken}";
            string lockValue = Guid.NewGuid().ToString();
            bool lockAcquired = await _tokenStore.TryAcquireLockAsync(lockKey, lockValue, lockTimeout);

            // If the database is locked: there is another user or request currently writing to it
            // so we wait until it finishes its write and get the ready values instead of writing our own essentially overwriting the old work
            // and having redundant keys
            if (!lockAcquired)
            {
                int maxPollAttempts = 5;
                int pollIntervalMs = 15;

                for (int i = 0; i < maxPollAttempts; i++)
                {
                    await Task.Delay(pollIntervalMs);

                    var polledReplacement = await _tokenStore.GetActiveReplacementAsync(oldRefreshToken);
                    if (polledReplacement is not null)
                    {
                        var polledUserId = await _tokenStore.GetUserIdByTokenAsync(polledReplacement);
                        if (polledUserId is not null)
                        {
                            return await GenerateResultAsync(polledUserId, polledReplacement);
                        }
                    }
                }

                return null;
            }

            try
            {
                var postLockReplacement = await _tokenStore.GetActiveReplacementAsync(oldRefreshToken);
                if (postLockReplacement is not null)
                {
                    var existingUserId = await _tokenStore.GetUserIdByTokenAsync(postLockReplacement);
                    return existingUserId is not null ? await GenerateResultAsync(existingUserId, postLockReplacement) : null;
                }

                var userId = await _tokenStore.GetUserIdByTokenAsync(oldRefreshToken);
                if (userId is null) return null;

                var newToken = GenerateRefreshToken();
                bool success = await _tokenStore.TryRotateTokenAsync(oldRefreshToken, newToken, userId, tokenLifetime, gracePeriod);

                if (success)
                {
                    return await GenerateResultAsync(userId, newToken);
                }

                return null;
            }
            finally
            {
                await _tokenStore.ReleaseLockAsync(lockKey, lockValue);
            }
        }

        private async Task<TokenRefreshResult?> GenerateResultAsync(string userId, string refreshToken)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null) return null;

            var jwtToken = GenerateJwtToken(user);
            return new TokenRefreshResult(refreshToken, jwtToken);
        }
    }
}
