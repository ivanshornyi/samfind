import { apiClient } from "../../vars/axios-instance";

const signIn = async () => {
  try {
    await apiClient.post("/auth/sign-in");
  } catch (error) {
    console.log(error);
  }
};

export const AuthApiService = {
  signIn,
};