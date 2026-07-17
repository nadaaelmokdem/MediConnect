using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Data.Configurations
{
    public class DoctorAvailabilityConfiguration : IEntityTypeConfiguration<DoctorAvailability>
    {
        public void Configure(EntityTypeBuilder<DoctorAvailability> builder)
        {
            builder.HasIndex(da => da.DoctorId);

            // Prevent the exact same slot definition being submitted twice (double-click, retried
            // save, etc). Two filtered indexes are needed because SQL Server treats NULLs as
            // distinct in a unique index, so a single index wouldn't catch duplicate recurring
            // (SpecificDate == null) rows.
            builder.HasIndex(da => new { da.DoctorId, da.DayOfWeek, da.StartTime, da.EndTime })
                .IsUnique()
                .HasFilter("[SpecificDate] IS NULL");

            builder.HasIndex(da => new { da.DoctorId, da.SpecificDate, da.StartTime, da.EndTime })
                .IsUnique()
                .HasFilter("[SpecificDate] IS NOT NULL");
        }
    }
}
