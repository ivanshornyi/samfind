import { LicenseTierType } from "@/types";

export type LicensingOptionType = {
  id: number;
  title: string;
  tierType: LicenseTierType;
  description: string;
  price: number;
  buttonText: string;
  buttonVariant: "default" | "secondary";
  features: string[];
  footerText?: string;
  isPremium: boolean;
};
