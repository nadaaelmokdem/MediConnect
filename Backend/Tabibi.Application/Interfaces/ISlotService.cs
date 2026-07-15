using Tabibi.Application.DTOs;
using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface ISlotService
{
    Task<List<DoctorAvailability>> GetActiveAvailabilitiesAsync(int doctorId, DateOnly date);
    Task<List<Appointment>> GetBlockingAppointmentsAsync(int doctorId, DateOnly date);
    bool IsBlockedByExistingAppointment(DateTime slotStart, int slotDurationMins, IReadOnlyList<Appointment> blockingAppointments);
    Task<bool> IsSlotAvailableAsync(int doctorId, DateTime scheduledAt, int durationMins = 30);
    Task<SlotValidationResult> ValidateSlotAsync(int doctorId, DateTime scheduledAt, int durationMins = 30);
}

