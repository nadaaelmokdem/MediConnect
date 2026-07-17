using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasIndex(a => new { a.PatientId, a.DoctorId });
            builder.HasIndex(a => a.ScheduledAt);

            // Prevent double-booking the same doctor slot; cancelled appointments free the slot back up.
            builder.HasIndex(a => new { a.DoctorId, a.ScheduledAt })
                .IsUnique()
                .HasFilter("[Status] <> 3");
        }
    }
}
