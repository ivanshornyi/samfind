import { User, UserStatus } from "@/types";

import { handleApiError } from "@/errors";

import { apiClient } from "@/vars";

const getUser = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);

    return response.data as User;
  } catch(error: any) {
    handleApiError(error);
  }
};

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  status?: UserStatus;
};

const updateUser = async (id: string, data: UpdateUserData) => {
  try {
    await apiClient.patch(`/user/${id}`, {
      ...data,
    });
  } catch(error: any) {
    handleApiError(error);
  }
};

export const UserApiService = {
  getUser,
  updateUser,
};