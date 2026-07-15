using Tabibi.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Tabibi.Application.DTOs;
namespace Tabibi.API.Services;

public class AppointmentNotificationService(IHubContext<AppointmentHub> hubContext) : Tabibi.Application.Interfaces.IAppointmentNotificationService
{
    private static string UserGroupName(string userId) => $"user-{userId}";

    public Task NotifyDoctorNewAppointmentAsync(
        string doctorUserId,
        AppointmentBookedDTO appointment)
    {
        return hubContext.Clients
            .Group(UserGroupName(doctorUserId))
            .SendAsync("NewAppointmentBooked", appointment);
    }

    public Task NotifyPatientConfirmationAsync(
        string patientUserId,
        AppointmentBookedDTO appointment)
    {
        return hubContext.Clients
            .Group(UserGroupName(patientUserId))
            .SendAsync("AppointmentBookedConfirmation", appointment);
    }

    public Task NotifyPatientCancellationAsync(
        string patientUserId,
        AppointmentListDTO appointment)
    {
        return hubContext.Clients
            .Group(UserGroupName(patientUserId))
            .SendAsync("AppointmentCancelled", appointment);
    }
}








