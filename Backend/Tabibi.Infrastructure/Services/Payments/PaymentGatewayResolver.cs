using Microsoft.Extensions.DependencyInjection;
using Tabibi.Core.Models;

namespace Tabibi.Infrastructure.Services.Payments
{
    public class PaymentGatewayResolver(IServiceProvider serviceProvider)
    {
        public IPaymentGatewayStrategy Resolve(PaymentGateway gateway)
        {
            // Strategy resolution based on enum
            return gateway switch
            {
                PaymentGateway.Geidea => serviceProvider.GetRequiredService<GeideaPaymentStrategy>(),
                // PaymentGateway.Stripe => serviceProvider.GetRequiredService<StripePaymentStrategy>(),
                _ => throw new NotImplementedException($"Payment gateway '{gateway}' is not implemented.")
            };
        }
    }
}



