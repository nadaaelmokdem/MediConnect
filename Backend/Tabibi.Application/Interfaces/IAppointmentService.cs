using Tabibi.Application.DTOs;
using Tabibi.Application.Shared;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IAppointmentService
{
    Task<List<AvailableSlotDTO>> GetAvailableSlots(int doctorId, DateOnly date, ConsultationType? consultationType = null);
    Task<bool> IsSlotAvailableAsync(int doctorId, DateTime scheduledAt, int durationMins = 30);
    Task<ServiceResult<AppointmentBookedDTO>> BookAppointmentAsync(string patientUserId, BookAppointmentDTO request);
    Task AutoCompleteTodayAppointmentsAsync(int? patientId = null, int? doctorId = null);
    Task<List<AppointmentListDTO>> GetDoctorAppointmentsAsync(string doctorUserId, AppointmentFilterDTO filters);
    Task<List<AppointmentListDTO>> GetPatientAppointmentsAsync(string patientUserId, AppointmentFilterDTO filters);
    Task<ServiceResult<AppointmentListDTO>> CancelAppointmentAsync(string doctorUserId, int appointmentId);
}
