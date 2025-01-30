import { PricingPlan, LicenseTierType } from "@/types";

export const pricingPlans: PricingPlan[] = [
  {
    title: "Freemium Business",
    description:
      "Boost your capabilities with premium features and priority support.",
    price: 0,
    currency: "USD",
    billingPeriod: "forever",
    features: ["Essential features", "Community access", "Basic support"],
    license: {
      tierType: LicenseTierType.Freemium,
      usersLimit: 1,
    },
  },
  {
    title: "Yearly",
    description:
      "Boost your capabilities with premium features and priority support.",
    price: 8.3,
    currency: "USD",
    billingPeriod: "month, billed yearly",
    features: ["Enhanced capabilities", "Priority updates", "Premium support"],
    license: {
      tierType: LicenseTierType.Standard,
      usersLimit: 5,
    },
    isBestValue: true,
  },
  {
    title: "Monthly",
    description:
      "Boost your capabilities with premium features and priority support.",
    price: 9.99,
    currency: "USD",
    billingPeriod: "month, billed monthly",
    features: ["Enhanced capabilities", "Priority updates", "Premium support"],
    license: {
      tierType: LicenseTierType.Standard,
      usersLimit: 5,
    },
  },
];
