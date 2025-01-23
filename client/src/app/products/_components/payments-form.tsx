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
          variant="tetrary"
          className="mt-3 w-[120px] bg-slate-400"
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
