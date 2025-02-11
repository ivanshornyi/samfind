"udr client";

import { 
  useActivateSubscription, 
  useCancelSubscription, 
  useGetPlans,
  useGetUserSubscriptionInfo, 
} from "@/hooks";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  Button,
  AlertDialogFooter,
} from "@/components";
import { X } from "lucide-react";

import { PricingCard } from "../pricing-card";

import { parseISO, isBefore } from "date-fns";

export const ManageSubscriptionModal = () => {
  const { data: plans } = useGetPlans();
  const { data: userSubscription } = useGetUserSubscriptionInfo();
  const { 
    mutate: cancelSubscriptionMutation, 
    isPending: isCancelSubscriptionPending,
  } = useCancelSubscription();
  const { 
    mutate: activateSubscriptionMutation, 
    isPending: isActivateSubscriptionPending,
  } = useActivateSubscription();

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
      <AlertDialogContent 
        className="
          w-full max-w-[800px] overflow-auto h-[100dvh] rounded-none 
          md:h-[700px] md:rounded-2xl
        "
      >
        <div className="absolute right-5 top-5">
          <AlertDialogCancel className="shadow-none border-none p-1 rounded-full bg-card">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl leading-[44px] font-semibold">
            Manage subscription
          </AlertDialogTitle>
          <AlertDialogDescription className="text-disabled">
            Choose the plan that fits your needs
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-2 flex-wrap justify-center md:flex-nowrap">
          {plans?.map(plan => (
            <div key={plan.id}>
              <PricingCard
                plan={plan}
                withButton={false} 
                currentUserPlanId={userSubscription?.plan.id}
              />
            </div>
          ))}
        </div>

        {userSubscription && (
          <AlertDialogFooter>
            <div className="flex items-center w-full gap-2">
              {userSubscription.isActive && !isBefore(parseISO(userSubscription.nextDate), new Date()) && (
                <Button 
                  variant="tetrary"
                  onClick={() => cancelSubscriptionMutation(userSubscription.id)}
                  withLoader
                  loading={isCancelSubscriptionPending}
                >
                  Cancel subscription
                </Button>
              )}

              {(!userSubscription.isActive || isBefore(parseISO(userSubscription.nextDate), new Date())) && (
                <Button 
                  variant="tetrary"
                  onClick={() => activateSubscriptionMutation(userSubscription.id)}
                  withLoader
                  loading={isActivateSubscriptionPending}
                >
                  Activate subscription
                </Button>
              )}
            </div>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
