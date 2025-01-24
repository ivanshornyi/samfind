export type LicensingOptionType = {
  id: number;
  title: string;
  description: string;
  price?: number;
  buttonText: string;
  buttonVariant: "default" | "secondary";
  features: string[];
  footerText?: string;
  isPremium: boolean;
};
