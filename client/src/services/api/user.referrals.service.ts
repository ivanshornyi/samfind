import { handleApiError } from "@/errors";
import { apiClient } from "@/vars";

export const getUserReferralsById = async (id: string) => {
  try {
    const response = await apiClient.get(`/user-referral/${id}`);

    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};
