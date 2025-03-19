import { LicenseTierType, PlanPeriod, PlanType } from "@/types";

export type LicensingOptionType = {
  id: number | string;
  title: string;
  period: PlanPeriod;
  tierType: LicenseTierType | PlanType;
  description: string;
  price: number;
  buttonText: string;
  buttonVariant: "default" | "secondary" | "purple";
  features: string[];
  footerText?: string;
  isPremium: boolean;
  background: string | undefined;
  ulText: string | undefined;
  border: string | undefined;
};
