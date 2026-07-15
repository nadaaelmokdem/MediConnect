using Tabibi.Application.DTOs;
using Tabibi.Core.Models;
using Tabibi.Application.Shared;

namespace Tabibi.Application.Extensions
{
    public static class AppUserExtensions
    {
        public static UserResponse ToResponse(this AppUser user)
        {
            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email ?? "",
                FullName = user.FullName!,
                PhoneNumber = user.PhoneNumber!,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt
            };
        }
    }
}


