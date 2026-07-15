using Tabibi.Application.DTOs;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IAdminService
{
    Task<AdminDashboardDTO> GetDashboard();
    Task<List<PendingDoctorDTO>> GetPendingDoctors();
    Task<List<AdminDoctorDTO>> GetAllDoctors(DoctorVerificationStatus? status = null);
    Task<AdminDoctorDetailDTO?> GetDoctorDetail(int doctorId);
    Task<List<DoctorProfileChangeLogDTO>> GetDoctorChanges(int doctorId);
    Task<ServiceResult> VerifyDoctor(int doctorId, ReviewDoctorRequestDTO request);
    Task<List<AdminUserDTO>> GetAllUsers();
    Task<ServiceResult> SetUserActive(string userId, bool isActive);
    Task<List<AdminAppointmentDTO>> GetAppointments();
}
