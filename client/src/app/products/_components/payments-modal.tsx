"use client";

import React, { useContext } from "react";

import { AuthContext } from "@/context";

import { useGetStripeClient } from "@/hooks";

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
  license: { name: string; key: string };
}

export const PaymentsModal: React.FC<PaymentsModalProps> = ({
  amount,
  currency,
  license,
}) => {
  const { user } = useContext(AuthContext);

  const {
    mutate: getStripeClientMutation,
    isPending: isGetStripeClientPending,
    data: stripClientData,
  } = useGetStripeClient();

  const handleIntent = () => {
    if (user) {
      getStripeClientMutation({
        amount,
        currency,
        userId: user.id,
        licenseKey: license.key,
        licenseName: license.name,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="text-sm w-full" // if user registered
          onClick={handleIntent}
        >
          Buy
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[700px] max-h-[90dvh] overflow-auto rounded-2xl">
        <div className="absolute right-0 top-0">
          <AlertDialogCancel className="shadow-none border-none p-3">
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle>Payments</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your credentials
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          {!isGetStripeClientPending && stripClientData && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: stripClientData.client_secret }}
            >
              <PaymentsForm license={license} />
            </Elements>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
