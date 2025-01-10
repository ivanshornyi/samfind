import { handleApiError } from "@/errors";
import { apiClient } from "@/vars/axios-instance";
import { User } from "@shared/types";

const findUsers = async () => {
  try {
    const response = await apiClient.get("/user/find", {
      params: { name: "", offset: 0, limit: 10 },
    });

    return response.data;
  } catch (err) {
    handleApiError(err);
  }
};

const findUserById = async (id: string) => {
  try {
    const response = await apiClient.get(`/user/${id}`);

    return response.data;
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
  updateUser,
};
