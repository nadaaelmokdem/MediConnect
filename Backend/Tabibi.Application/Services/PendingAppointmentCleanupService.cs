using Microsoft.EntityFrameworkCore;
using Tabibi.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Tabibi.Core.Models;

namespace Tabibi.Application.Services
{
    public class PendingAppointmentCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public PendingAppointmentCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();

                    var pendingPayments = await unitOfWork.Payments.Query()
                        .Include(p => p.Appointment)
                        .Where(p => p.Status == PaymentStatus.Pending)
                        .ToListAsync(stoppingToken);

                    var now = DateTime.UtcNow;
                    foreach (var payment in pendingPayments)
                    {
                        if (payment.ExternalOrderId != null && payment.ExternalOrderId.StartsWith("GEID-"))
                        {
                            var parts = payment.ExternalOrderId.Split('-');
                            if (parts.Length >= 3 && long.TryParse(parts.Last(), out long ticks))
                            {
                                var createdAt = new DateTime(ticks);
                                if ((now - createdAt).TotalMinutes > 15)
                                {
                                    if (payment.Appointment != null)
                                    {
                                        unitOfWork.Appointments.Remove(payment.Appointment);
                                    }
                                    unitOfWork.Payments.Remove(payment);
                                }
                            }
                        }
                    }

                    await unitOfWork.CompleteAsync(stoppingToken);
                }
                catch (Exception)
                {
                    // Log error if logger is available, ignore for now to keep service running
                }

                await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
            }
        }
    }
}







