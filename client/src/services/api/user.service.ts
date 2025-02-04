import { User, UserStatus } from "@/types";

import { handleApiError } from "@/errors";

import { apiClient } from "@/vars";

const getUser = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);

    return response.data as User;
  } catch (error) {
    handleApiError(error);
  }
};

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  status?: UserStatus;
}

const updateUser = async (id: string, data: UpdateUserData) => {
  try {
    await apiClient.patch(`/user/${id}`, {
      ...data,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const updateUserReferral = async (referralCode: number, newUserId: string) => {
  try {
    await apiClient.patch(`/user/referral/${referralCode}`, {
      newUserId,
    });
  } catch (error) {
    handleApiError(error);
  }
};

export interface UserInfo {
  organizationOwner: boolean; // with organization
  standardUser: boolean; // private with license, (standard tier)
  freemiumUser: boolean; // private with freemium tier (without ActiveLicense bu with License)
  invitedUser: boolean; // added by invitation (with ActiveLicense)
}

const getUserSubscriptionInfo = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/subscription-info/${id}`);

    return response.data as UserInfo;
  } catch (error) {
    handleApiError(error);
  }
};

const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete(`/user/${id}`);

    return response.data as UserInfo;
  } catch (error) {
    handleApiError(error);
  }
};

export const UserApiService = {
  getUser,
  updateUser,
  updateUserReferral,
  getUserSubscriptionInfo,
  deleteUser,
};
