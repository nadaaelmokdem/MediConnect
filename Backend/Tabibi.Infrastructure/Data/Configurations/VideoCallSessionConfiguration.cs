using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class VideoCallSessionConfiguration : IEntityTypeConfiguration<VideoCallSession>
    {
        public void Configure(EntityTypeBuilder<VideoCallSession> builder)
        {
            builder.HasKey(vs => vs.SessionId);

            builder.HasOne(vs => vs.Doctor)
                .WithMany()
                .HasForeignKey(vs => vs.DoctorId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(vs => vs.Patient)
                .WithMany()
                .HasForeignKey(vs => vs.PatientId)
                .IsRequired(true)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(vs => vs.PatientId);
        }
    }
}
