using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class DoctorProfileConfiguration : IEntityTypeConfiguration<DoctorProfile>
    {
        public void Configure(EntityTypeBuilder<DoctorProfile> builder)
        {
            // Only tighten the delete behavior of the existing convention-discovered
            // DoctorProfile -> AppUser relationship; redeclaring it via HasOne()/WithOne()
            // makes EF think it's a second relationship and adds a bogus shadow FK.
            builder.Metadata.FindNavigation(nameof(DoctorProfile.User))!.ForeignKey.DeleteBehavior = DeleteBehavior.Restrict;

            builder.HasMany(d => d.DoctorSpecialties)
                .WithOne(ds => ds.Doctor)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(d => d.OldSpecialties)
                .WithOne(ds => ds.Doctor)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(d => d.Availabilities)
                .WithOne(da => da.Doctor)
                .HasForeignKey(da => da.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(d => d.Appointments)
                .WithOne(a => a.Doctor)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
