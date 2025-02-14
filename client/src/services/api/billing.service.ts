import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";
import { BillingHistoryItem, DiscountHistoryItem } from "@/types/billings";

const getBillingHistory = async (id: string) => {
  try {
    const response = await apiClient.get(`/subscription/history/${id}`);

    return response.data as BillingHistoryItem[];
  } catch (error) {
    handleApiError(error);
  }
};

const getDiscountHistory = async (id: string) => {
  try {
    const response = await apiClient.get(
      `/subscription/discount-history/${id}`
    );

    return response.data as DiscountHistoryItem[];
  } catch (error) {
    handleApiError(error);
  }
};

export const BillingApiServices = {
  getBillingHistory,
  getDiscountHistory,
};
