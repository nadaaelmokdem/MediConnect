using Tabibi.Application.DTOs;

namespace Tabibi.Application.Interfaces;

public interface IAppointmentNotificationService
{
    Task NotifyDoctorNewAppointmentAsync(string doctorUserId, AppointmentBookedDTO appointment);
    Task NotifyPatientConfirmationAsync(string patientUserId, AppointmentBookedDTO appointment);
    Task NotifyPatientCancellationAsync(string patientUserId, AppointmentListDTO appointment);
}
