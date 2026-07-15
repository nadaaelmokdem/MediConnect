using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class PatientProfileConfiguration : IEntityTypeConfiguration<PatientProfile>
    {
        public void Configure(EntityTypeBuilder<PatientProfile> builder)
        {
            builder.HasMany(p => p.ChatSessions)
                .WithOne(cs => cs.Patient)
                .HasForeignKey(cs => cs.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(p => p.Appointments)
                .WithOne(a => a.Patient)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Quota)
                .WithOne(q => q.Patient)
                .HasForeignKey<PatientQuota>(q => q.PatientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
