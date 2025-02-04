import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

export interface CreatePaymentData {
  userId: string;
  planId: string;
  quantity: number;
  userReferralCode?: number;
  discount?: {
    amount: number;
    description: string;
  };
}

const createPayment = async (data: CreatePaymentData) => {
  try {
    const response = await apiClient.post("/subscription", {
      ...data,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const PaymentSubscriptionApiService = {
  createPayment,
};