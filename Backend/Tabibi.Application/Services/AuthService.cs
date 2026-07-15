using Tabibi.Application.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Tabibi.Application.DTOs;
using Tabibi.Application.Interfaces;
using Tabibi.Application.Shared;
using Tabibi.Core.Models;

namespace Tabibi.Application.Services;

public class AuthService(
    ITokenStore tokenStore,
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager,
    IAuthUtils authUtils,
    IUnitOfWork unitOfWork,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<ServiceResult> Logout(string token)
    {
        if (await tokenStore.RevokeTokenAsync(token))
            return ServiceResult.Success();

        return ServiceResult.Failure("User is not logged in!");
    }

    public async Task<ServiceResult<EmailResultEnum>> CheckMail(string mail, bool isDoctor = false)
    {
        var user = await userManager.FindByEmailAsync(mail);
        if (user is null)
            return ServiceResult<EmailResultEnum>.Failure("Email doesn't exist!", EmailResultEnum.NotFound);

        var roleEnum = isDoctor == false ? UserRoles.Patient : UserRoles.Doctor;
        if (await userManager.IsInRoleAsync(user, roleEnum))
            return ServiceResult<EmailResultEnum>.Success(EmailResultEnum.Ok);

        return ServiceResult<EmailResultEnum>.Failure("Unauthorized user!", EmailResultEnum.WrongRole);
    }

    public async Task<ServiceResult<LoginDTO?>> Login(LoginRequest req)
    {
        var user = await userManager.FindByEmailAsync(req.Email);
        if (user is null)
            return ServiceResult<LoginDTO?>.Failure("User is not registered!");

        var res = await signInManager.CheckPasswordSignInAsync(user, req.Password, true);
        if (res.Succeeded)
        {
            var roles = await userManager.GetRolesAsync(user);
            var userResponse = user.ToResponse();
            userResponse.Roles = roles.ToList();

            if (roles.Contains(UserRoles.Doctor))
            {
                var doctor = await unitOfWork.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == user.Id);
                userResponse.IsVerified = doctor?.IsVerified ?? false;
                userResponse.ProfilePictureUrl = doctor?.ProfilePictureUrl;
            }

            var refreshToken = authUtils.GenerateRefreshToken();
            TimeSpan tokenLifetime = TimeSpan.FromDays(7);
            await tokenStore.StoreTokenAsync(refreshToken, user.Id, tokenLifetime);

            return ServiceResult<LoginDTO?>.Success(new LoginDTO
            {
                User = userResponse,
                Token = authUtils.GenerateJwtToken(user, roles),
                RefreshToken = refreshToken
            });
        }

        return ServiceResult<LoginDTO?>.Failure("Incorrect username or password!");
    }

    public async Task<ServiceResult<LoginDTO?>> Register(SignupRequest signupRequest)
    {
        if (string.IsNullOrEmpty(signupRequest.Email))
            return ServiceResult<LoginDTO?>.Failure("Email is required!");

        if (string.IsNullOrEmpty(signupRequest.PhoneNumber))
            return ServiceResult<LoginDTO?>.Failure("Phone number is required!");

        var phoneExists = await userManager.Users.AnyAsync(u => u.PhoneNumber == signupRequest.PhoneNumber);
        if (phoneExists)
            return ServiceResult<LoginDTO?>.Failure("Phone number is already registered!");

        var user = new AppUser
        {
            UserName = signupRequest.Email,
            FullName = signupRequest.FullName,
            Email = signupRequest.Email,
            EmailConfirmed = false,
            PhoneNumber = signupRequest.PhoneNumber,
            PhoneNumberConfirmed = false
        };

        var res = await userManager.CreateAsync(user, signupRequest.Password);
        if (!res.Succeeded)
            return ServiceResult<LoginDTO?>.Failure(string.Join(", ", res.Errors.Select(e => e.Description)));

        using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            if (signupRequest.Role.Equals(UserRoles.Doctor, StringComparison.CurrentCultureIgnoreCase))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Doctor);
                await unitOfWork.DoctorProfiles.AddAsync(new DoctorProfile { UserId = user.Id });
            }
            else if (signupRequest.Role.Equals(UserRoles.Patient, StringComparison.CurrentCultureIgnoreCase))
            {
                await userManager.AddToRoleAsync(user, UserRoles.Patient);
                var patientProfile = new PatientProfile { UserId = user.Id };
                await unitOfWork.PatientProfiles.AddAsync(patientProfile);
                await unitOfWork.PatientQuotas.AddAsync(new PatientQuota { Patient = patientProfile });
            }
            else
            {
                await transaction.RollbackAsync();
                return ServiceResult<LoginDTO?>.Failure("Incorrect role, valid options: (doctor, user) or keep the parameter empty!");
            }

            await unitOfWork.CompleteAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            logger.LogError(ex, "Registration failed for user {Email}", signupRequest.Email);
            throw;
        }

        var roles = await userManager.GetRolesAsync(user);
        var userResponse = user.ToResponse();
        userResponse.Roles = roles.ToList();

        if (roles.Contains(UserRoles.Doctor))
        {
            var doctor = await unitOfWork.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == user.Id);
            userResponse.IsVerified = doctor?.IsVerified ?? false;
            userResponse.ProfilePictureUrl = doctor?.ProfilePictureUrl;
        }

        var refreshToken = authUtils.GenerateRefreshToken();
        TimeSpan tokenLifetime = TimeSpan.FromDays(7);
        await tokenStore.StoreTokenAsync(refreshToken, user.Id, tokenLifetime);

        return ServiceResult<LoginDTO?>.Success(new LoginDTO
        {
            User = userResponse,
            Token = authUtils.GenerateJwtToken(user, roles),
            RefreshToken = refreshToken,
        });
    }

    public async Task<ServiceResult> AddToRole(string email, string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
            return ServiceResult.Failure("User doesn't exist!");

        IdentityResult? res = null;

        using var transaction = await unitOfWork.BeginTransactionAsync();
        try
        {
            if (role.Equals(UserRoles.Doctor, StringComparison.CurrentCultureIgnoreCase))
            {
                res = await userManager.AddToRoleAsync(user, UserRoles.Doctor);
                if (res.Succeeded && !await unitOfWork.DoctorProfiles.Query().AnyAsync(p => p.UserId == user.Id))
                    await unitOfWork.DoctorProfiles.AddAsync(new DoctorProfile { UserId = user.Id });
            }
            else if (role.Equals(UserRoles.Patient, StringComparison.CurrentCultureIgnoreCase))
            {
                res = await userManager.AddToRoleAsync(user, UserRoles.Patient);
                if (res.Succeeded && !await unitOfWork.PatientProfiles.Query().AnyAsync(p => p.UserId == user.Id))
                {
                    var patientProfile = new PatientProfile { UserId = user.Id };
                    await unitOfWork.PatientProfiles.AddAsync(patientProfile);
                    await unitOfWork.PatientQuotas.AddAsync(new PatientQuota { Patient = patientProfile });
                }
            }
            else
            {
                await transaction.RollbackAsync();
                return ServiceResult.Failure("Incorrect role, valid options: (doctor, user) or keep the parameter empty!");
            }

            if (res != null && res.Succeeded)
            {
                await unitOfWork.CompleteAsync();
                await transaction.CommitAsync();
                return ServiceResult.Success();
            }
            else
            {
                await transaction.RollbackAsync();
                return ServiceResult.Failure(res != null ? string.Join(", ", res.Errors.Select(e => e.Description)) : "Role assignment failed");
            }
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            logger.LogError(ex, "AddToRole failed for user {Email}", email);
            throw;
        }
    }
}



