import React, { useContext, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  Button,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  Input,
} from "@/components";

import { X } from "lucide-react";
import { useCreateSharesInvoice, useBuyShares } from "@/hooks";
import { PurchaseType } from "@/types/share";
import { AuthContext } from "@/context";
import { ShareholderForm } from "./shareholder-form";

interface BuySharesProps {
  bonusAmount: number;
  sharePrice: number;
}

export const BuyShares = ({ bonusAmount, sharePrice }: BuySharesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bonusSharesQuantity, setBonusSharesQuantity] = useState(0);
  const [moneySharesQuantity, setMoneySharesQuantity] = useState(0);
  const [pending, setPending] = useState(false);

  const { user } = useContext(AuthContext);
  const { mutate: createInvoice, isPending: isCreateInvoicePending } =
    useCreateSharesInvoice();
  const { mutate: payByBonus, isPending: isPayByBonusPending } = useBuyShares();

  useEffect(() => {
    if ((isPayByBonusPending || isCreateInvoicePending) && !pending)
      setPending(true);
    if (!isPayByBonusPending && !isCreateInvoicePending && pending) {
      setPending(false);
      setIsModalOpen(false);
    }
  }, [pending, isPayByBonusPending, isCreateInvoicePending]);

  const handleSubmit = () => {
    if (bonusSharesQuantity && user) {
      payByBonus({
        quantity: bonusSharesQuantity,
        price: sharePrice,
        userId: user?.id,
        purchaseType: PurchaseType.Bonus,
      });
    }
    if (moneySharesQuantity && user) {
      createInvoice({
        userId: user.id,
        quantity: moneySharesQuantity,
      });
    }
  };

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Buy Shares
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px] max-h-[95vh] overflow-y-auto">
        <div className="absolute right-1 top-1">
          <AlertDialogCancel
            onClick={() => setIsModalOpen(false)}
            className="shadow-none border-none p-3"
          >
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px] leading-[33px] font-semibold">
            Buy Shares
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="mt-4">
          <p className="text-base md:text-xl font-normal text-nowrap">{`Buy for Bonus - ${bonusAmount / 100}€`}</p>
          <div className="flex items-center justify-start gap-4 mt-4">
            <div className="w-[100px]">
              <Input
                name="bonusShares"
                type="number"
                max={Math.floor(bonusAmount / sharePrice)}
                min={0}
                value={bonusSharesQuantity}
                onChange={(e) => setBonusSharesQuantity(Number(e.target.value))}
              />
            </div>

            <p className="w-[150px]">{`X ${sharePrice / 100}€ = ${(sharePrice * bonusSharesQuantity) / 100}€`}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-base md:text-xl font-normal text-nowrap">
            Buy for Money
          </p>
          <div className="flex items-center justify-start gap-4 mt-4">
            <div className="w-[100px]">
              <Input
                name="bonusShares"
                type="number"
                min={0}
                value={moneySharesQuantity}
                onChange={(e) => setMoneySharesQuantity(Number(e.target.value))}
              />
            </div>

            <p className="w-[150px]">{`X ${sharePrice / 100}€ = ${(sharePrice * moneySharesQuantity) / 100}€`}</p>
          </div>
        </div>

        {/* <ShareholderForm /> */}

        <AlertDialogFooter className="flex gap-6 w-full">
          <Button
            onClick={handleSubmit}
            variant="purple"
            className="w-full"
            withLoader
            loading={pending}
            disabled={!bonusSharesQuantity && !moneySharesQuantity}
          >
            Buy
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
