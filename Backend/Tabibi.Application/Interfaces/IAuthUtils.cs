using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IAuthUtils
{
    string GenerateRefreshToken();
    string GenerateJwtToken(AppUser user, IList<string> roles);
}
