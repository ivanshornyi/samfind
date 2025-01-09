import { apiClient } from "@/vars/axios-instance";

const findUsers = async () => {
  try {
    const response = await apiClient.get("/user/find", {
      params: { name: "", offset: 0, limit: 10 },
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const userApiService = {
  findUsers,
};
