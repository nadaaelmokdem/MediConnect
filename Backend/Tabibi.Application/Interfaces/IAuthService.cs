using Tabibi.Application.DTOs;
using Tabibi.Application.Shared;

namespace Tabibi.Application.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<LoginDTO?>> Login(LoginRequest req);
    Task<ServiceResult<LoginDTO?>> GoogleLogin(GoogleLoginRequest req);
    Task<ServiceResult<LoginDTO?>> Register(SignupRequest signupRequest);
    Task<ServiceResult> Logout(string token);
    Task<ServiceResult<EmailResultEnum>> CheckMail(string mail, bool isDoctor = false);
    Task<ServiceResult> AddToRole(string email, string role);
}
