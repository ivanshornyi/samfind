import React, { useEffect, useState } from "react";

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
import { useUpdateUserWallet, useGetUserWallet } from "@/hooks";
import { Wallet } from "@/types";

export const ConvertToDiscountModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertAmount, setConvertAmount] = useState("");
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const { data: userWallet } = useGetUserWallet();
  const {
    mutate: updateUserWallet,
    isSuccess,
    isPending,
  } = useUpdateUserWallet();

  const transferBonusToDiscount = () => {
    if (!wallet) return;
    const amount = Number(convertAmount) * 100;
    if (isNaN(amount) || amount <= 0) return;

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
      } else if (numericValue > wallet!.bonusAmount / 100) {
        value = (wallet!.bonusAmount / 100).toFixed(2);
      }
    }

    setConvertAmount(value);
  };

  const handleClickMax = () => {
    setConvertAmount((wallet!.bonusAmount / 100).toFixed(2));
  };

  const onClose = () => {
    setIsModalOpen(false);
    setConvertAmount("");
    setWallet(null);
  };

  useEffect(() => {
    if (userWallet) setWallet(userWallet);
  }, [userWallet]);

  useEffect(() => {
    if (isSuccess && Number(convertAmount) > 0) onClose();
  }, [isSuccess, convertAmount]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger className="w-full" asChild>
        <Button
          className="w-full"
          onClick={() => setIsModalOpen(true)}
          variant="saveProfile"
        >
          Apply as Discount
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px] max-h-[95vh] overflow-y-auto">
        <div className="absolute right-1 top-1">
          <AlertDialogCancel
            onClick={onClose}
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

        <p className="mt-5 text-[16px] leading-[22px] font-semibold">
          Enter the desired amount
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1">
            <Input
              name="convertAmount"
              type="text"
              value={convertAmount}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center flex-1 ml-4 gap-2">
            <p
              onClick={handleClickMax}
              className="text-[20px] leading-[27px] font-semibold text-[#CE9DF3] cursor-pointer p-0"
            >
              Max
            </p>
            <p className="text-[16px] leading-[22px] text-disabled p-0">
              <span className="font-bold">
                {" "}
                €{(wallet?.bonusAmount || 0) / 100}
              </span>
              {"  "} bonuses Available
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex mt-8 w-full">
          <Button
            onClick={transferBonusToDiscount}
            variant="purple"
            className="w-full"
            withLoader
            loading={isPending}
            disabled={!convertAmount}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
