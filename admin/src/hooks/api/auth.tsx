import { AuthContext } from "@/context";
import { useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { UserAuthType } from "@/types";
import { useNavigate } from "react-router";
import { AuthApiService } from "@/services";
import { handleToastError } from "@/errors";

export const useSignIn = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { toast } = useToast();
  
    const { ...rest } = useMutation({
      mutationFn: (data: {
        email: string;
        password: string;
        authType: UserAuthType;
      }) => AuthApiService.signIn(data.email, data.password, data.authType),
      onSuccess: (data: { accessToken: string; refreshToken: string }) => {
        toast({
          title: "Success",
          description: "Successfully logged in",
        });
  
        login(data.accessToken, data.refreshToken);
        navigate("/");
      },
      onError: (error) => {
        handleToastError(error, toast);
      },
    });
  
    return rest;
  };