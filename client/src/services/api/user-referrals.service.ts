import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

interface ReferralItems {
  userId: string;
  name: string;
  activationDate: string;
  amount: number;
}

const getUserReferralUsers = async (userId: string) => {
  try {
    const response = await apiClient.get(`/user-referral/${userId}`);

    return response.data as ReferralItems[];
  } catch (error) {
    handleApiError(error);
  }
};

export const UserReferralApiService = {
  getUserReferralUsers,
}