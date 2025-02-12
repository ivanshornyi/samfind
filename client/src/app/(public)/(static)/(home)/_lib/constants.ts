import { LicenseTierType, PlanPeriod } from "@/types";
import { LicensingOptionType } from "../_types";

export const licensingOptions: LicensingOptionType[] = [
  {
    id: 1,
    title: "Freemium",
    period: PlanPeriod.Monthly,
    tierType: LicenseTierType.Freemium,
    description: "Essential features for personal and community use",
    price: 0,
    buttonText: "Get Started Free",
    buttonVariant: "secondary",
    features: ["Essential features", "Community access", "Basic support"],
    footerText: "Community Edition",
    isPremium: false,
  },
  {
    id: 2,
    title: "Standard",
    period: PlanPeriod.Monthly,
    tierType: LicenseTierType.Standard,
    description:
      "Boost your capabilities with premium features and priority support.",
    price: 9.99,
    buttonText: "Buy Standard",
    buttonVariant: "default",
    features: ["Enhanced capabilities", "Priority updates", "Premium support"],
    footerText: undefined,
    isPremium: true,
  },
];
