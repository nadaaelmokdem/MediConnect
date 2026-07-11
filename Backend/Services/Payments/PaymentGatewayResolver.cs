using Tabibi.Models;

namespace Tabibi.Services.Payments
{
    public class PaymentGatewayResolver(IServiceProvider serviceProvider)
    {
        public IPaymentGatewayStrategy Resolve(PaymentGateway gateway)
        {
            // Strategy resolution based on enum
            return gateway switch
            {
                PaymentGateway.Kasheir => serviceProvider.GetRequiredService<KasheirPaymentStrategy>(),
                // PaymentGateway.Stripe => serviceProvider.GetRequiredService<StripePaymentStrategy>(),
                _ => throw new NotImplementedException($"Payment gateway '{gateway}' is not implemented.")
            };
        }
    }
}
