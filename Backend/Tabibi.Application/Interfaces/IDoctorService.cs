using Tabibi.Application.DTOs;

namespace Tabibi.Application.Interfaces;

public interface IDoctorService
{
    Task<DoctorProfileDTO?> GetProfile(string userId);
    Task<ServiceResult> UpdateProfileField(string userId, string fieldName, string value);
    Task<ServiceResult<DoctorProfileDTO>> BulkUpdateProfile(string userId, DoctorProfileBulkUpdateDTO profileData);
    Task<DoctorDashboardDTO?> GetDashboard(string userId);
    Task<List<DoctorAvailabilityDTO>> GetAvailabilities(string userId);
    Task<ServiceResult> UpdateAvailabilities(string userId, UpdateAvailabilityRequestDTO request);
}
