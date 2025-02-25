export interface AppSettings {
  id: string;
  sharePrice?: number;
  shareStripeProductId?: string;
  shareStripePriceId?: string;
  limitOfSharesPurchased?: number;
  currentSharesPurchased?: number;
  earlyBirdPeriod: boolean;
  createdAt: string;
  updatedAt: string;
}
