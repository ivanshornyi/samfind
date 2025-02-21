"use client";

import { useEffect, useState } from "react";
import { useGetUserWallet, useUpdateUserWallet } from "@/hooks";
import { BalanceType, Wallet } from "@/types";

import { BalanceInfo } from "./_components";

export default function WalletPage() {
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

  useEffect(() => {
    if (userWallet) setWallet(userWallet);
  }, [userWallet]);

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="w-full">
        <h2 className="text-[32px] leading-[44px] font-semibold">Wallet</h2>
        <div className="flex justify-center gap-4 mt-10">
          <BalanceInfo
            transferBonusToDiscount={transferBonusToDiscount}
            balance={(wallet?.bonusAmount || 0) / 100}
            balanceType={BalanceType.Bonus}
          />
          <BalanceInfo
            transferBonusToDiscount={transferBonusToDiscount}
            balance={(wallet?.discountAmount || 0) / 100}
            balanceType={BalanceType.Discount}
          />
          <BalanceInfo
            transferBonusToDiscount={transferBonusToDiscount}
            balance={wallet?.sharesAmount || 0}
            balanceType={BalanceType.Shares}
          />
        </div>
      </div>
    </div>
  );
}
