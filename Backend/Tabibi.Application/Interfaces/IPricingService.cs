using Tabibi.Core.Models;

namespace Tabibi.Application.Interfaces;

public interface IPricingService
{
    Task<decimal?> GetPriceAsync(int doctorId, ConsultationType type);
}
