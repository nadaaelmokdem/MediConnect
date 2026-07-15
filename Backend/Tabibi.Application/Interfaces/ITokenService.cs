using Tabibi.Application.DTOs;

namespace Tabibi.Application.Interfaces;

public interface ITokenService
{
    Task<TokenRefreshResult?> RefreshTokenAsync(string oldRefreshToken);
}
public record TokenRefreshResult(string NewRefreshToken, string JwtToken);
