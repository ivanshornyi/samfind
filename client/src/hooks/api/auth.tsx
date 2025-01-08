import { useContext } from "react";

import { useRouter } from "next/navigation";

import { AuthContext } from "@/context";

import { useMutation } from "@tanstack/react-query";

import { AuthApiService, UserAuthType } from "@/services";

import { useToast } from "@/hooks";

import { handleToastError } from "@/errors";

export const useSignIn = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();

  const { ...rest } = useMutation({
    mutationFn: (data: { email: string, password: string, authType: UserAuthType }) => AuthApiService.signIn(data.email, data.password, data.authType),
    onSuccess: (data: { accessToken: string, refreshToken: string }) => {
      toast({
        title: "Success",
        description: "Successfully logged in",
      });

      login(data.accessToken, data.refreshToken);
      router.push("/");
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return rest;
};

type SignUpData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authType: UserAuthType;
};

export const useSignUp = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();

  const { ...rest } = useMutation({
    mutationFn: (data: SignUpData) => AuthApiService.signUp(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.authType,
    ),
    onSuccess: (data: { accessToken: string, refreshToken: string }) => {
      toast({
        title: "Success",
        description: "Successfully logged in",
      });

      login(data.accessToken, data.refreshToken);
      router.push("/");
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return rest;
};

export const useSendVerificationCode = () => {
  const { toast } = useToast();

  const { ...rest } = useMutation({
    mutationFn: (email: string) => AuthApiService.sendVerificationCode(email),
    onSuccess: () => {
      toast({
        description: "Successfully sended",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return rest;
};

type ResetPasswordData = {
  email: string;
  verificationCode: string;
  newPassword: string;
};

export const useResetPassword = () => {
  const router = useRouter();
  const { toast } = useToast();

  const { ...rest } = useMutation({
    mutationFn: (data: ResetPasswordData) => AuthApiService.resetPassword(
      data.email,
      data.verificationCode,
      data.newPassword,
    ),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully updated",
      });

      router.push("/auth/sign-in");
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return rest;
};