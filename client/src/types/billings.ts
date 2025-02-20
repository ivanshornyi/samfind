export interface BillingHistoryItem {
  id: string;
  number: string;
  url?: string;
  pdf?: string;
  status: "paid" | "unpaid";
  price: number;
  afterDiscount?: number;
  description?: string;
  date: number;
  payDate?: number;
}

export interface DiscountHistoryItem {
  id: string;
  date: string | Date;
  type: "income" | "expense";
  amount: number;
  description: string;
}
