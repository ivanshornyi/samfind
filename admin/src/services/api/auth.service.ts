import { UserAuthType } from "@shared/types";
import { apiClient } from "@/vars";

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
    console.log(error);
  }
};

export const AuthApiService = {
  signIn,
};
