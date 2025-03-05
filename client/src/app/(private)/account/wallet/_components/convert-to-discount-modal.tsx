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
  AlertDialogDescription,
} from "@/components";

import { X } from "lucide-react";
import {
  useCreateSharesInvoice,
  useBuyShares,
  useUpdateUserWallet,
  useGetUserWallet,
} from "@/hooks";
import { PurchaseType } from "@/types/share";
import { AuthContext } from "@/context";
import { Wallet } from "@/types";

export const ConvertToDiscountModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const { data: userWallet } = useGetUserWallet();
  const { mutate: updateUserWallet } = useUpdateUserWallet();

  const transferBonusToDiscount = (amount: number) => {
    if (!wallet) return;
    updateUserWallet({
      id: wallet.id,
      bonusAmount: wallet.bonusAmount - amount,
      discountAmount: wallet.discountAmount + amount,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    value = value.replace(/[^0-9.]/g, "");

    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
      return;
    }

    if (value.includes(".")) {
      const [integer, decimal] = value.split(".");
      if (decimal.length > 2) {
        value = `${integer}.${decimal.slice(0, 2)}`;
      }
    }

    const numericValue = parseFloat(value);

    if (!isNaN(numericValue)) {
      if (numericValue < 0) {
        value = "0";
      } else if (numericValue > wallet!.bonusAmount) {
        value = wallet!.bonusAmount.toFixed(2);
      }
    }

    setConvertAmount(value);
  };

  useEffect(() => {
    if (userWallet) setWallet(userWallet);
  }, [userWallet]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger asChild>
        <Button onClick={() => setIsModalOpen(true)} variant="saveProfile">
          Apply as Discount
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
            Convert bonuses to discount
          </AlertDialogTitle>
          <AlertDialogDescription className="text-disabled">
            Will be paid off next month and cover your subscription
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <Input
            name="convertAmount"
            type="text"
            value={convertAmount}
            onChange={handleInputChange}
            placeholder="0.00"
          />
        </div>

        {/* <ShareholderForm /> */}

        <AlertDialogFooter className="flex gap-6 w-full">
          {/* <Button
            onClick={transferBonusToDiscount}
            variant="purple"
            className="w-full"
            withLoader
            loading={pending}
            disabled={!bonusSharesQuantity && !moneySharesQuantity}
          >
            Buy
          </Button> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
