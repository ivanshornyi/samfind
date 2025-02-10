"udr client";

import { useGetPlans } from "@/hooks";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  Button,
  AlertDialogFooter,
} from "@/components";
// import { Check, X } from "lucide-react";
import { CancelSubscriptionModal } from "../cancel-subscription-modal";

export const ManageSubscriptionModal = () => {
  // get subscription info
  // get plans

  const { data: plans, isPending: isPlansPending } = useGetPlans();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost"
          className="text-blue-50"
        >
          Manage subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl leading-[44px] font-semibold">
            Manage subscription
          </AlertDialogTitle>
          <AlertDialogDescription className="leading-[22px] text-disabled">
            Choose the plan that fits your needs
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2 p-4">
          {plans?.map(plan => (
            <div key={plan.id}>
              {plan.price}
            </div>
          ))}
        </div>

        <AlertDialogFooter className="flex justify-start">
          <CancelSubscriptionModal />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
