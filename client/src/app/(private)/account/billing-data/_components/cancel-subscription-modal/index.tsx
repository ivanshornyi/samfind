import { 
  AlertDialogHeader, 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription, 
  AlertDialogTitle, 
  AlertDialogTrigger, 
  Button
} from "@/components/ui";
import {
  
} from "@/components";
import { X } from "lucide-react";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

export const CancelSubscriptionModal = () => {
  // cancel subscription handle
  // get subscription

  // const { mutate: cancelSubscriptionMutation } = useCancelSubscription();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost"
        >
          Cancel subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold">
           Are you sure you want to cancel your subscription? 
          </AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>

        <p className="text-[#C4C4C4] text-[16px] leading-[22px] mt-2">
          If you cancel, you&apos;ll lose access to all the benefits of your
          subscription. Your subscription is active until the next billing date:
          [Month] 1st.
        </p>

        <div className="flex gap-4 mt-8">
          <AlertDialogCancel className="w-1/2 bg-[#383838] hover:bg-[#424242] text-white rounded-full h-[56px] text-[16px]">
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="flex-1 bg-[#FF6C6C] hover:bg-[#FF5252] text-white rounded-full h-[56px] text-[16px]"
            // onClick={onConfirm}
            withLoader

          >
            Continue
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
