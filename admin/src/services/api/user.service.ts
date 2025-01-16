import { handleApiError } from "@/errors";
import { apiClient } from "@/vars";
import { User, UserReferralInfo } from "@/types";

const findUsers = async (
  name: string,
  offset: number,
  limit: number
): Promise<User[] | undefined> => {
  try {
    const response = await apiClient.get("/user/find", {
      params: { name, offset, limit },
    });

    return response.data as User[];
  } catch (err) {
    handleApiError(err);
  }
};

const findUserById = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);

    return response.data as User;
  } catch (err) {
    handleApiError(err);
  }
};

const findUsersByIds = async (ids: string[]) => {
  try {
    const response = await apiClient.get("/user/find/find-by-ids", {
      params: { userId: ids },
    });

    return response.data as User[];
  } catch (err) {
    handleApiError(err);
  }
};

const getUserReferralInfo = async (id: string) => {
  try {
    const response = await apiClient.get(`/user-referral/${id}`);

    return response.data as UserReferralInfo;
  } catch (err) {
    handleApiError(err);
  }
};

const updateUser = async (id: string, data: Partial<User>) => {
  try {
    const response = await apiClient.patch(`/user/${id}`, data);

    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

export const userApiService = {
  findUsers,
  findUserById,
  findUsersByIds,
  getUserReferralInfo,
  updateUser,
};
