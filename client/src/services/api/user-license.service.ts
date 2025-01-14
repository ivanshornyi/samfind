import { UserLicense } from "@/types";

import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

const getUserLicense = async (id: string) => {
  try {
    const response = await apiClient.get(`/user-license/${id}`);

    return response.data as UserLicense;
  } catch (error) {
    handleApiError(error);
  }
};

const getUserLicenses = async (userId: string) => {
  try {
    const response = await apiClient.get(`/user-license/find/${userId}`);

    return response.data as UserLicense[];
  } catch (error) {
    handleApiError(error);
  }
};

export const UserLicenseApiService = {
  getUserLicense,
  getUserLicenses,
};
