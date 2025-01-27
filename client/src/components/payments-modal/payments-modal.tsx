"use client";

import React, { useContext, useState } from "react";

import { AuthContext } from "@/context";

import { CreateIntent } from "@/services";

import { useGetStripeClient } from "@/hooks";

import { LicenseTierType } from "@/types";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  Button,
} from "@/components";
import { PaymentsForm } from "./payments-form";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { X } from "lucide-react";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripePublishableKey as string);

interface PaymentsModalProps {
  amount: number;
  currency: string;
  license: { tierType: LicenseTierType; };
  buttonText: string;
}

export const PaymentsModal: React.FC<PaymentsModalProps> = ({
  amount,
  currency,
  license,
  buttonText,
}) => {
  const { user } = useContext(AuthContext);

  const {
    mutate: getStripeClientMutation,
    isPending: isGetStripeClientPending,
    data: stripClientData,
  } = useGetStripeClient();

  const handleIntent = () => {
    const referral = localStorage.getItem("userReferralCode");

    if (user) {
      let intent: CreateIntent = {
        amount,
        currency,
        limit: 10,
        tierType: license.tierType,
        userId: user.id,
      };

      if (referral) {
        intent = {
          ...intent,
          userReferralCode: Number(referral),
        };
      }

      getStripeClientMutation(intent);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full"
          onClick={handleIntent}
          disabled={!user || amount === 0}
        >
          {buttonText}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[700px] max-h-[90dvh] overflow-auto rounded-2xl bg-white">
        <div className="absolute right-0 top-1">
          <AlertDialogCancel className="rounded-1 bg-transparent shadow-none border-none text-black hover:text-black">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader className="flex">
          <div>
            <AlertDialogTitle className="text-black text-xl">Payments</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Enter your credentials
            </AlertDialogDescription>
          </div>
          <div className="text-black">
            <p className="font-semibold text-lg">{amount / 100}$</p>
            <p className="capitalize">{license.tierType} tier</p>
          </div>
        </AlertDialogHeader>

        <div>
          {!isGetStripeClientPending && stripClientData && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: stripClientData.client_secret }}
            >
              <PaymentsForm />
            </Elements>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
