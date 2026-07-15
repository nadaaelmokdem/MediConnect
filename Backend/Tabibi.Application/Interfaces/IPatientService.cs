using Tabibi.Application.DTOs;

namespace Tabibi.Application.Interfaces;

public interface IPatientService
{
    Task<ServiceResult> UpdateProfileField(string userId, string fieldName, string value);
    Task<ServiceResult> UpdateData(string userId, PatientExtraDTO patientData);
    ServiceResult ValidatePatientExtras(PatientExtraDTO patientData);
    Task<PatientProfileDTO?> GetProfile(string userId);
    Task<PatientDashboardDTO?> GetDashboard(string userId);
}

