import { UserAccountType } from "@/types";

import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

export enum UserAuthType {
  Email = "email",
}

const signIn = async (
  email: string,
  password: string,
  authType: UserAuthType
) => {
  try {
    const response = await apiClient.post("/auth/sign-in", {
      email,
      password,
      authType,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authType: UserAuthType;
  accountType: UserAccountType;
  organization?: {
    name: string;
    VAT: string;
    businessOrganizationNumber: string;
    domain?: string;
  }
};

const signUp = async (data: SignUpData) => {
  try {
    const response = await apiClient.post("/auth/sign-up", {
      ...data,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const sendVerificationCode = async (email: string) => {
  try {
    await apiClient.post("/auth/send-verification-code", {
      email,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const resetPassword = async (
  email: string,
  verificationCode: string,
  newPassword: string
) => {
  try {
    await apiClient.post("/auth/reset-password", {
      email,
      verificationCode,
      newPassword,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const sendVerificationCodeToUpdateEmail = async (
  userId: string,
  email: string,
  password: string
) => {
  try {
    await apiClient.post("/auth/email/send-verification-code", {
      userId,
      email,
      password,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const updateEmail = async (
  userId: string,
  verificationCode: string,
  newEmail: string
) => {
  try {
    await apiClient.post("/auth/email/update", {
      userId,
      verificationCode,
      newEmail,
    });
  } catch (error) {
    handleApiError(error);
  }
};

export interface VerifyData {
  email: string;
  verificationCode: string;
  licenseId?: string;
  organizationId?: string;
}

const verifyUser = async (data: VerifyData) => {
  try {
    const response = await apiClient.post("/auth/verify", {
      ...data,
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const AuthApiService = {
  signIn,
  signUp,
  sendVerificationCode,
  resetPassword,
  sendVerificationCodeToUpdateEmail,
  updateEmail,
  verifyUser,
};
