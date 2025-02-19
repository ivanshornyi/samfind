import {
  MailApiService,
  SendSupportEmailData,
} from "@/services/api/mail.service";
import { useToast } from "../use-toast";
import { useMutation } from "@tanstack/react-query";

export const useSendSupportEmail = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: SendSupportEmailData) => {
      return MailApiService.sendSupportEmail(data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Email sent successfully",
        variant: "success",
      });
    },
  });
};
