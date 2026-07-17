using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class DoctorSpecialtyConfiguration : IEntityTypeConfiguration<DoctorSpecialty>
    {
        public void Configure(EntityTypeBuilder<DoctorSpecialty> builder)
        {
            builder.HasIndex(ds => ds.SpecialtyId);

            builder.HasIndex(ds => new { ds.DoctorId, ds.SpecialtyId })
                .IsUnique();
        }
    }
}
