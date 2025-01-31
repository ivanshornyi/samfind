import { PaymentHistory } from "./_components/payment-history";
import { PricingPlans } from "./_components/pricing-plans";
import { SubscriptionDetails } from "./_components/subscription-details";

export default function BillingData() {
  const userLicense = true;

  return (
    <div className="w-full text-white">
      <div className="space-y-8">
        <div>
          {userLicense ? (
            <SubscriptionDetails
              plan="Standart Monthly"
              status="Active subscription"
              renewalDate="February 02, 2025"
              price={9.99}
              billingPeriod="month, billed monthly"
              members={{ admin: 1, regular: 0 }}
            />
          ) : (
            <PricingPlans />
          )}
        </div>

        <div>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl">Payment history</h2>
          </div>
          <PaymentHistory />
        </div>
      </div>
    </div>
  );
}
