using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class DoctorReviewConfiguration : IEntityTypeConfiguration<DoctorReview>
    {
        public void Configure(EntityTypeBuilder<DoctorReview> builder)
        {
            builder.HasOne(dr => dr.Appointment)
                .WithOne(a => a.Review)
                .HasForeignKey<DoctorReview>(dr => dr.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(dr => dr.AppointmentId);
        }
    }
}
