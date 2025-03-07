import {
  LicenseTierType,
  PlanPeriod,
  User,
  UserShareholderData,
  UserStatus,
  Wallet,
} from "@/types";

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
  languageName?: string;
  languageCode?: string;
}

export interface UpdateUserWalletData {
  id: string;
  discountAmount?: number;
  bonusAmount?: number;
  sharesAmount?: number;
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
  deletedMember: boolean; // deleted from admin License
}

const getUserRoleSubscriptionInfo = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/subscription-role-info/${id}`);

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

export interface InvitedUserInfo {
  license: {
    id: string;
    ownerId: string;
    tierType: LicenseTierType;
    updatedAt: string;
  };
  licenseOwner: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organizationId: string | null;
    organizationName?: string;
  };
}

const getInvitedUserInfo = async (userId: string) => {
  try {
    const response = await apiClient.get(
      `/user/find-invited-user/info/${userId}`
    );

    return response.data as InvitedUserInfo;
  } catch (error) {
    handleApiError(error);
  }
};

interface UserSubscriptionInfo {
  id: string;
  isActive: boolean;
  nextDate: string;
  newPlanId?: string;
  plan: {
    id: string;
    type: LicenseTierType;
    period: PlanPeriod;
    price: number;
  };
  license: {
    limit: number;
    tierType: LicenseTierType;
    _count: { activeLicenses: number };
  };
}

const getUserSubscriptionInfo = async (userId: string) => {
  try {
    const response = await apiClient.get(`/user/subscription-info/${userId}`);

    return response.data as UserSubscriptionInfo;
  } catch (error) {
    handleApiError(error);
  }
};

const getUserOrganizationName = async (organizationId: string) => {
  try {
    const response = await apiClient.get(
      `/user/organization-name/${organizationId}`
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getUserName = async (licenseId: string) => {
  try {
    const response = await apiClient.get(`/user/user-name/${licenseId}`);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getUseWallet = async (userId: string) => {
  try {
    const response = await apiClient.get(`/wallet/${userId}`);

    return response.data as Wallet;
  } catch (error) {
    handleApiError(error);
  }
};

const updateUserWallet = async (data: UpdateUserWalletData) => {
  try {
    await apiClient.put(`/wallet`, {
      ...data,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const getUserShareholderData = async (userId: string) => {
  try {
    const response = await apiClient.get(`/user/shareholder/${userId}`);

    return response.data as UserShareholderData | null;
  } catch (error) {
    handleApiError(error);
  }
};

const addUserShareholderData = async (
  data: Omit<UserShareholderData, "id" | "createdAt" | "updatedAt">
) => {
  try {
    await apiClient.post(`/user/shareholder`, {
      ...data,
    });
  } catch (error) {
    handleApiError(error);
  }
};

export const UserApiService = {
  getUser,
  updateUser,
  updateUserReferral,
  getUserRoleSubscriptionInfo,
  getUserSubscriptionInfo,
  deleteUser,
  getInvitedUserInfo,
  getUserOrganizationName,
  getUserName,
  getUseWallet,
  updateUserWallet,
  getUserShareholderData,
  addUserShareholderData,
};
