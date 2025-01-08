import { User, UserStatus } from "@/types";

import { apiClient } from "@/vars";

const getUser = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);

    return response.data as User;
  } catch(error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong.");
    }

    throw new Error("Server connection error");
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
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong.");
    }

    throw new Error("Server connection error");
  }
};

export const UserApiService = {
  getUser,
  updateUser,
};