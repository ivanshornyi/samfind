import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/components/ui";
import { X } from "lucide-react";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
import { format } from "date-fns";
import { useCancelSubscription } from "@/hooks";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return format(date, "MMMM dd, yyyy");
};

interface CancelSubscriptionModalProps {
  nexDate: string;
  subscriptionId: string;
}

export const CancelSubscriptionModal = ({
  nexDate,
  subscriptionId,
}: CancelSubscriptionModalProps) => {
  const {
    mutate: cancelSubscriptionMutation,
    isPending: isCancelSubscriptionPending,
  } = useCancelSubscription();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost">Cancel subscription</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold">
            Are you sure you want to cancel your subscription?
          </AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        <div className="absolute right-5 top-5">
          <AlertDialogCancel className="shadow-none border-none p-1 rounded-full bg-card">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <p className="text-[#C4C4C4] text-[16px] leading-[22px] mt-2">
          If you cancel, you’ll lose access to all the benefits of your
          subscription. Your subscription is active until the next billing date:
          {formatDate(nexDate)}.
        </p>

        <div className="flex gap-4 mt-8">
          <AlertDialogCancel className="w-1/2 bg-[#383838] hover:bg-[#424242] text-white rounded-full h-[56px] text-[16px]">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="flex-1 bg-[#FF6C6C] hover:bg-[#FF5252] text-white rounded-full h-[56px] text-[16px]"
            onClick={() => cancelSubscriptionMutation(subscriptionId)}
            withLoader
            loading={isCancelSubscriptionPending}
          >
            Continue
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
