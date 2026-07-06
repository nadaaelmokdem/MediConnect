using System.Data;
using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.DTOs;
using Tabibi.Models;

namespace Tabibi.Services;

public class AppointmentService(
    AppDbContext dbContext,
    SlotService slotService,
    PricingService pricingService,
    AppointmentNotificationService notificationService)
{
    public async Task<List<AvailableSlotDTO>> GetAvailableSlots(
        int doctorId,
        DateOnly date,
        ConsultationType? consultationType = null)
    {
        var availabilities = await slotService.GetActiveAvailabilitiesAsync(
            doctorId,
            date.DayOfWeek);

        if (availabilities.Count == 0)
            return [];

        var blockingAppointments = await slotService.GetBlockingAppointmentsAsync(
            doctorId,
            date);

        decimal? price = null;
        if (consultationType.HasValue)
        {
            price = await pricingService.GetPriceAsync(doctorId, consultationType.Value);
        }

        var slots = new List<AvailableSlotDTO>();

        foreach (var availability in availabilities)
        {
            var current = availability.StartTime;
            var slotStep = TimeSpan.FromMinutes(availability.SlotDurationMins);

            while (current + slotStep <= availability.EndTime)
            {
                var start = SlotService.TruncateToMinute(
                    date.ToDateTime(TimeOnly.FromTimeSpan(current)));

                var end = start.AddMinutes(availability.SlotDurationMins);

                var isAvailable = !slotService.IsBlockedByExistingAppointment(
                    start,
                    availability.SlotDurationMins,
                    blockingAppointments);

                if (start > DateTime.Now)
                {
                    slots.Add(new AvailableSlotDTO
                    {
                        Start = start,
                        End = end,
                        IsAvailable = isAvailable,
                        Price = price
                    });
                }

                current += slotStep;
            }
        }

        return slots
            .OrderBy(s => s.Start)
            .ToList();
    }

    public Task<bool> IsSlotAvailableAsync(
        int doctorId,
        DateTime scheduledAt,
        int durationMins = SlotService.DefaultSlotDurationMins) =>
        slotService.IsSlotAvailableAsync(doctorId, scheduledAt, durationMins);

    public async Task<ServiceResult<AppointmentBookedDTO>> BookAppointmentAsync(
        string patientUserId,
        BookAppointmentDTO request)
    {
        var patient = await dbContext.PatientProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == patientUserId);

        if (patient == null)
            return ServiceResult<AppointmentBookedDTO>.Failure("Patient profile not found.");

        var normalizedScheduledAt = SlotService.TruncateToMinute(request.ScheduledAt);
        var durationMins = SlotService.DefaultSlotDurationMins;

        var price = await pricingService.GetPriceAsync(request.DoctorId, request.Type);
        if (!price.HasValue)
        {
            return ServiceResult<AppointmentBookedDTO>.Failure(
                "Consultation type is not available for this doctor.");
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            IsolationLevel.Serializable);

        try
        {
            var validation = await slotService.ValidateSlotAsync(
                request.DoctorId,
                normalizedScheduledAt,
                durationMins);

            if (!validation.IsValid)
            {
                await transaction.RollbackAsync();
                return ServiceResult<AppointmentBookedDTO>.Failure(validation.ErrorMessage);
            }

            var appointment = new Appointment
            {
                PatientId = patient.PatientId,
                DoctorId = request.DoctorId,
                ScheduledAt = normalizedScheduledAt,
                DurationMins = durationMins,
                ConsultationType = request.Type,
                Status = AppointmentStatus.Pending,
                Price = price.Value,
                ChiefComplaint = request.ChiefComplaint
            };

            dbContext.Appointments.Add(appointment);
            await dbContext.SaveChangesAsync();
            await transaction.CommitAsync();

            var bookedDto = new AppointmentBookedDTO
            {
                AppointmentId = appointment.AppointmentId,
                DoctorId = appointment.DoctorId,
                ScheduledAt = appointment.ScheduledAt,
                ConsultationType = appointment.ConsultationType,
                Status = appointment.Status,
                DurationMins = appointment.DurationMins,
                Price = appointment.Price,
                ChiefComplaint = appointment.ChiefComplaint
            };

            var doctorUserId = await dbContext.DoctorProfiles
                .AsNoTracking()
                .Where(d => d.DoctorId == request.DoctorId)
                .Select(d => d.UserId)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrEmpty(doctorUserId))
            {
                await notificationService.NotifyDoctorNewAppointmentAsync(
                    doctorUserId,
                    bookedDto);
            }

            await notificationService.NotifyPatientConfirmationAsync(
                patientUserId,
                bookedDto);

            return ServiceResult<AppointmentBookedDTO>.Success(bookedDto);
        }
        catch (DbUpdateException)
        {
            await transaction.RollbackAsync();
            return ServiceResult<AppointmentBookedDTO>.Failure(
                "This slot was just booked by another patient. Please choose a different time.");
        }
    }
}
