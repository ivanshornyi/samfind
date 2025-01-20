"use client";

import { useConfirmPayment } from "@/hooks";

import { PaymentElement } from "@stripe/react-stripe-js";

import { Button } from "@/components";

export const PaymentsForm = () => {
  const { mutate: confirmPaymentMutation, isPending: isConfirmPaymentPending } =
    useConfirmPayment();

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    confirmPaymentMutation();
  };

  return (
    <form onSubmit={handlePaymentSubmit}>
      <PaymentElement />

      <div className="flex justify-end">
        <Button
          className="mt-3 px-3"
          withLoader
          loading={isConfirmPaymentPending}
          disabled={isConfirmPaymentPending}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
