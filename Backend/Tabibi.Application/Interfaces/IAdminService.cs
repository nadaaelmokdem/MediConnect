using Tabibi.Application.DTOs;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IAdminService
{
    Task<AdminDashboardDTO> GetDashboard();
    Task<List<PendingDoctorDTO>> GetPendingDoctors();
    Task<List<AdminDoctorDTO>> GetAllDoctors(DoctorVerificationStatus? status = null);
    Task<AdminDoctorDetailDTO?> GetDoctorDetail(long doctorId);
    Task<List<DoctorProfileChangeLogDTO>> GetDoctorChanges(long doctorId);
    Task<ServiceResult> VerifyDoctor(long doctorId, ReviewDoctorRequestDTO request);
    Task<PagedResultDTO<AdminUserDTO>> GetAllUsers(AdminUserQueryDTO query);
    Task<AdminUserDetailDTO?> GetUserDetail(string userId);
    Task<ServiceResult> SetUserActive(string userId, bool isActive);
    Task<PagedResultDTO<AdminAppointmentDTO>> GetAppointments(AdminAppointmentQueryDTO query);
}
