import { useContext } from "react";

import { AuthContext } from "@/context";

import { useElements, useStripe } from "@stripe/react-stripe-js";

import { useMutation } from "@tanstack/react-query";
import { StripeApiService, CreateIntent } from "@/services";

import { handleApiError, handleToastError } from "@/errors";

import { toast } from "@/hooks";

const successRedirectUrl = process.env.NEXT_PUBLIC_SUCCESS_PAYMENT_REDIRECT_URL;

export const useGetStripeClient = () => {
  return useMutation({
    mutationFn: (data: CreateIntent) => StripeApiService.getStripeClient(data),
    onError: (error) => {
      handleToastError(error, toast);
    },
  });
};

export const useConfirmPayment = () => {
  const { user } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();

  const confirmPayment = async () => {
    if (stripe && elements && successRedirectUrl && user) {
      try {
        const response = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: successRedirectUrl,
          },
        });

        if (response.error) {
          toast({
            title: "Error",
            description: response.error.message,
          });
        } else {
          toast({
            title: "Success",
            description: "Successfully paid",
          });
        }
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const { ...mutationProps } = useMutation({
    mutationFn: () => confirmPayment(),
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};
