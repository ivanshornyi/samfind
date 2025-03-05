"udr client";

import {
  useGetAppSettings,
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
import { CancelSubscriptionModal } from "../cancel-subscription-modal";
import { useContext, useState } from "react";
import { AuthContext } from "@/context";
import { PlanType, UserAccountType } from "@/types";

export const ManageSubscriptionModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: plans } = useGetPlans();
  const { data: userSubscription } = useGetUserSubscriptionInfo();
  const { user } = useContext(AuthContext);
  const { data: appSettings } = useGetAppSettings();

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-blue-50">
          Manage subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="
          w-full max-w-[880px] overflow-auto h-[100dvh] rounded-none 
          md:h-[700px] md:rounded-[30px]
        "
      >
        <div className="absolute right-5 top-5">
          <AlertDialogCancel
            onClick={() => setIsOpen(false)}
            className="shadow-none border-none p-1 rounded-full bg-card"
          >
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

        <div className="flex gap-2 flex-wrap justify-around md:flex-nowrap">
          {plans
            ?.filter((plan) => {
              if (
                plan.type === PlanType.EarlyBird &&
                (!appSettings?.earlyBirdPeriod ||
                  appSettings.limitOfSharesPurchased! <=
                    appSettings.currentSharesPurchased!)
              )
                return false;
              if (
                plan.type !== PlanType.EarlyBird &&
                appSettings?.earlyBirdPeriod &&
                appSettings.limitOfSharesPurchased! >
                  appSettings.currentSharesPurchased!
              )
                return false;
              return user?.accountType === UserAccountType.Business
                ? plan.type !== PlanType.Freemium
                : true;
            })
            .map((plan) => (
              <div key={plan.id}>
                <PricingCard
                  plan={plan}
                  withButton={false}
                  currentUserPlanId={userSubscription?.plan.id}
                  isActive={userSubscription?.isActive}
                  subscriptionId={userSubscription?.id}
                  newPlanId={userSubscription?.newPlanId}
                  nextDate={userSubscription?.nextDate}
                  closePlansModal={() => setIsOpen(false)}
                />
              </div>
            ))}
        </div>

        {userSubscription && userSubscription.isActive && (
          <AlertDialogFooter>
            <div className="flex items-center w-full gap-2">
              <CancelSubscriptionModal
                nexDate={userSubscription.nextDate}
                subscriptionId={userSubscription.id}
              />
            </div>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
