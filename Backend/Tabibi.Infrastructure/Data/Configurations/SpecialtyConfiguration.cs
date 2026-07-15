using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class SpecialtyConfiguration : IEntityTypeConfiguration<Specialty>
    {
        public void Configure(EntityTypeBuilder<Specialty> builder)
        {
            builder.HasMany(s => s.DoctorSpecialties)
                .WithOne(ds => ds.Specialty)
                .HasForeignKey(ds => ds.SpecialtyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(s => s.DoctorOldSpecialties)
                .WithOne(ds => ds.Specialty)
                .HasForeignKey(ds => ds.SpecialtyId);
        }
    }
}
