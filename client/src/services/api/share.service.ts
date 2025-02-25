import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";
import { PurchaseType } from "@/types/share";

export interface CreateSharesInvoiceData {
  userId: string;
  quantity: number;
}

export interface BuySharesData {
  userId: string;
  quantity: number;
  price: number;
  purchaseType: PurchaseType;
}

const createSharesInvoice = async (data: CreateSharesInvoiceData) => {
  try {
    const response = await apiClient.post("/share/invoice", {
      ...data,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const buyShares = async (data: BuySharesData) => {
  try {
    const response = await apiClient.post("/share/buy", {
      ...data,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const ShareApiService = {
  createSharesInvoice,
  buyShares,
};
