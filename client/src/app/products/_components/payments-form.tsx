"use client";

import { useConfirmPayment } from "@/hooks";

import { PaymentElement, useElements } from "@stripe/react-stripe-js";

import { Button } from "@/components";

interface PaymentsFormProps {
  license: { name: string; key: string };
}

export const PaymentsForm: React.FC<PaymentsFormProps> = ({ license }) => {
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
