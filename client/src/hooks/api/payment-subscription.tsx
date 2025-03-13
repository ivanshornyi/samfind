import {
  ChangeSubscriptionPlanData,
  CreatePaymentData,
  PaymentSubscriptionApiService,
} from "@/services";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../use-toast";

import { handleToastError } from "@/errors";

const handleRedirect = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  // link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const usePaySubscription = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: CreatePaymentData) =>
      PaymentSubscriptionApiService.createPayment(data),
    onSuccess: (data: { url: string }) => {
      handleRedirect(data.url);
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
    mutationFn: (id: string) =>
      PaymentSubscriptionApiService.cancelSubscription(id),
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
    mutationFn: (id: string) =>
      PaymentSubscriptionApiService.activateSubscription(id),
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

export const useChangeSubscriptionPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: ChangeSubscriptionPlanData) =>
      PaymentSubscriptionApiService.changeSubscriptionPlan(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully changed",
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

export const useCancelChangeSubscriptionPlan = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (subscriptionId: string) =>
      PaymentSubscriptionApiService.cancelChangeSubscriptionPlan(
        subscriptionId
      ),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Successfully changed",
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
