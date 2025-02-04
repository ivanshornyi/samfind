"use client";

import { useContext, useState } from "react";

import { AuthContext } from "@/context";

import { Plan, PlanPeriod } from "@/types";
import { usePaySubscription } from "@/hooks";

import { CreatePaymentData } from "@/services";

import { Button } from "@/components";

export const PlanCard = ({ plan } : { plan: Plan }) => {
  const { user } = useContext(AuthContext);

  const { mutate: paySubscriptionMutation, isPending: isPaySubscriptionPending } = usePaySubscription();

  const [quantity, setQuantity] = useState(1);

  const paySubscription = (planId: string) => {
    if (user) {
      let payment: CreatePaymentData = {
        userId: user.id,
        planId,
        quantity,
      };

      const userReferralCode = user.invitedReferralCode;

      if (userReferralCode) {
        payment = {
          ...payment,
          userReferralCode,
          discount: {
            amount: 10,
            description: "",
          }
        }
      }

      paySubscriptionMutation(payment);
    }
  };

  return (
    <div 
      className="bg-blue-50/10 rounded-2xl px-6 py-8 flex flex-col gap-y-4"
    >
      <p className="capitalize font-semibold text-xl">{plan.period}</p> 
      <p>Boost your capabilities with premium features and priority support.</p>
      <p>
        <span className="text-[36px]">{plan.price}</span>
        <span>/month, billed monthly{plan.period === PlanPeriod.Monthly}</span>
      </p>

      <ul>

      </ul>

      <Button 
        variant="secondary"
        className="w-full"
        onClick={() => paySubscription(plan.id)}
        withLoader
        loading={isPaySubscriptionPending}
      >
        Get started
      </Button>
    </div>
  );
}