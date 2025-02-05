import { LicenseTierType } from "./license";

export interface PricingPlan {
  title: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  license: {
    tierType: LicenseTierType;
    usersLimit: number;
  };
  isBestValue?: boolean;
}
