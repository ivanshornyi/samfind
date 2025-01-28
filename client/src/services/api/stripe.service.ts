import { apiClient } from "@/vars";

import { LicenseTierType } from "@/types";

import { handleApiError } from "@/errors";

export interface CreateIntent {
  userId: string;
  amount: number;
  currency: string;
  limit: number;
  tierType: LicenseTierType;
  userReferralCode?: number;
}

const getStripeClient = async (data: CreateIntent) => { 
  try {
    const response = await apiClient.post("/stripe/create-payment-intent", {
      ...data,
    });

    console.log(response.data);

    return response.data as { client_secret: string };
  } catch (error) {
    handleApiError(error);
  }
};

export const StripeApiService = {
  getStripeClient,
};
