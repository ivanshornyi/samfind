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

interface ConvertToBonusModalProps {
  from: "Sales balance" | "Sweat equity";
}

export const ConvertToBonusModal = ({ from }: ConvertToBonusModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [max, setMax] = useState(0);
  const [convertAmount, setConvertAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const { data: userWallet } = useGetUserWallet();
  const { mutate: updateUserWallet, isPending } = useUpdateUserWallet();

  const transferBonusToDiscount = () => {
    if (!wallet) return;
    const amount = Number(convertAmount) * 100;
    if (isNaN(amount) || amount <= 0) return;

    const data =
      from === "Sales balance"
        ? {
            id: wallet.id,
            salesAmount: wallet.salesAmount - amount,
            bonusAmount: wallet.bonusAmount + amount,
          }
        : {
            id: wallet.id,
            sweatAmount: wallet.sweatAmount - amount,
            bonusAmount: wallet.bonusAmount + amount,
          };

    updateUserWallet(data);
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
      } else if (numericValue > max / 100) {
        value = (max / 100).toFixed(2);
      }
    }

    setConvertAmount(value);
  };

  const handleClickMax = () => {
    setConvertAmount((max / 100).toFixed(2));
  };

  const onClose = () => {
    setIsModalOpen(false);
    setConvertAmount("");
  };

  useEffect(() => {
    if (userWallet) {
      setWallet(userWallet);
      if (from === "Sales balance") setMax(userWallet.salesAmount);
      else setMax(userWallet.sweatAmount);
    }
  }, [from, userWallet]);

  useEffect(() => {
    if (isPending && !pending) setPending(true);
    if (!isPending && pending) {
      onClose();
    }
  }, [pending, isPending]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger className="w-full" asChild>
        <Button
          className="w-full"
          onClick={() => {
            setIsModalOpen(true);
          }}
          variant="saveProfile"
        >
          Transfer to Bonus
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
            {`Transfer ${from} balance to Bonus`}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-disabled">
            Will be transferred to Bonus
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
              <span className="font-bold"> €{(max || 0) / 100}</span>
              {"  "} Available
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
