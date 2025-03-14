import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "../use-toast";

import { handleToastError } from "@/errors";
import {
  BuySharesData,
  CreateSharesInvoiceData,
  ShareApiService,
} from "@/services/api/share.service";

const handleRedirect = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const useCreateSharesInvoice = () => {
  const { toast } = useToast();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: CreateSharesInvoiceData) =>
      ShareApiService.createSharesInvoice(data),
    onSuccess: (data: { url: string }) => {
      handleRedirect(data.url);
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};

export const useBuyShares = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { ...mutationProps } = useMutation({
    mutationFn: (data: BuySharesData) => ShareApiService.buyShares(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bought with bonuses successfully",
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-wallet"],
        refetchType: "all",
      });
    },
    onError: (error) => {
      handleToastError(error, toast);
    },
  });

  return mutationProps;
};
