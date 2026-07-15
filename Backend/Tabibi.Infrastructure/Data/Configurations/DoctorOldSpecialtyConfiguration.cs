using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class DoctorOldSpecialtyConfiguration : IEntityTypeConfiguration<DoctorOldSpecialty>
    {
        public void Configure(EntityTypeBuilder<DoctorOldSpecialty> builder)
        {
            builder.HasKey(ds => ds.Id);
            builder.HasIndex(ds => ds.DoctorId);
            builder.HasIndex(ds => ds.SpecialtyId);
        }
    }
}
