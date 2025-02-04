import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";
import { BillingHistoryItem } from "@/types/billings";

const getBillingHistory = async (id: string) => {
  try {
    const response = await apiClient.get(`/subscription/history/${id}`);

    return response.data as BillingHistoryItem[];
  } catch (error) {
    handleApiError(error);
  }
};

export const BillingApiServices = {
  getBillingHistory,
};
