import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

export interface CreateIntent {
  userId: string;
  amount: number;
  currency: string;
  licenseName: string;
  licenseKey: string;
}

const getStripeClient = async (data: CreateIntent) => {
  try {
    const response = await apiClient.post("/stripe/create-payment-intent", {
      ...data,
    });

    return response.data as { client_secret: string };
  } catch (error) {
    handleApiError(error);
  }
};

export const StripeApiService = {
  getStripeClient,
};
