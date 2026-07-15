using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasOne(pm => pm.Appointment)
                .WithOne(a => a.Payment)
                .HasForeignKey<Payment>(pm => pm.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(pm => pm.AppointmentId);
        }
    }
}
