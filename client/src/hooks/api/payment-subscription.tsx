import { CreatePaymentData, PaymentSubscriptionApiService } from "@/services";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "../use-toast";

import { handleToastError } from "@/errors";

export const usePaySubscription = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: CreatePaymentData) => PaymentSubscriptionApiService.createPayment(data),
    onSuccess: (data: { url: string }) => {
      window.open(data.url, "_blank");
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useCancelSubscription = () => {
  const { toast } = useToast();
  // get subscription

  const { ...mutationProps } = useMutation({
    mutationFn: (id: string) => PaymentSubscriptionApiService.cancelSubscription(""),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully canceled",
        variant: "success",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};