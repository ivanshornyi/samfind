import { License, LicenseList } from "@/types";

import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

export interface CreateUserLicense {
  userId: string;
  licenseId: string;
  name: string;
  key: string;
}

const addUserLicense = async (data: CreateUserLicense) => {
  try {
    await apiClient.post("/user-license", {
      ...data,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const getUserLicense = async (id: string) => {
  try {
    const response = await apiClient.get(`/user-license/${id}`);

    return response.data as License;
  } catch (error) {
    handleApiError(error);
  }
};

const getUserLicenses = async (userId: string) => {
  try {
    const response = await apiClient.get(`/user-license/find/${userId}`);

    return response.data as LicenseList | null;
  } catch (error) {
    handleApiError(error);
  }
};

export interface UpdateUserLicenseData {
  availableEmails: string[];
}

const updateUserLicense = async (id: string, data: UpdateUserLicenseData) => {
  try {
    const response = await apiClient.patch(`/user-license/${id}`, {
      ...data,
    });

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const UserLicenseApiService = {
  addUserLicense,
  getUserLicense,
  getUserLicenses,
  updateUserLicense,
};
