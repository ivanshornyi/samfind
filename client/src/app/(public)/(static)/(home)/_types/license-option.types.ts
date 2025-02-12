import { LicenseTierType, PlanPeriod, PlanType } from "@/types";

export type LicensingOptionType = {
  id: number | string;
  title: string;
  period: PlanPeriod;
  tierType: LicenseTierType | PlanType;
  description: string;
  price: number;
  buttonText: string;
  buttonVariant: "default" | "secondary";
  features: string[];
  footerText?: string;
  isPremium: boolean;
};
