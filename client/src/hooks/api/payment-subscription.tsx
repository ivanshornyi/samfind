import { CreatePaymentData, PaymentSubscriptionApiService } from "@/services";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (id: string) => PaymentSubscriptionApiService.cancelSubscription(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully canceled",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["subscription-user-info"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useActivateSubscription = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (id: string) => PaymentSubscriptionApiService.activateSubscription(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully activated",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["subscription-user-info"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};