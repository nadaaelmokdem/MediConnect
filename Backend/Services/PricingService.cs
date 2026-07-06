using Microsoft.EntityFrameworkCore;
using Tabibi.Data;
using Tabibi.Models;

namespace Tabibi.Services;

public class PricingService(AppDbContext dbContext)
{
    public async Task<decimal?> GetPriceAsync(int doctorId, ConsultationType type)
    {
        var specialties = await dbContext.DoctorSpecialties
            .AsNoTracking()
            .Where(ds => ds.DoctorId == doctorId)
            .ToListAsync();

        if (specialties.Count == 0)
            return null;

        var prices = specialties
            .Select(ds => GetPriceFromSpecialty(ds, type))
            .Where(price => price.HasValue)
            .Select(price => price!.Value)
            .ToList();

        return prices.Count == 0 ? null : prices.Min();
    }

    public decimal? GetPriceFromSpecialty(DoctorSpecialty specialty, ConsultationType type)
    {
        return type switch
        {
            ConsultationType.Chat when specialty.IsChatEnabled => specialty.ChatPrice,
            ConsultationType.Video when specialty.IsVideoEnabled => specialty.VideoPrice,
            ConsultationType.Call when specialty.IsCallEnabled => specialty.CallPrice,
            ConsultationType.Clinic when specialty.IsClinicEnabled => specialty.ClinicPrice,
            _ => null
        };
    }
}
