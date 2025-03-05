"use client";

import { useEffect, useState } from "react";
import {
  useGetAppSettings,
  useGetUserWallet,
  useUpdateUserWallet,
} from "@/hooks";
import { BalanceType, Wallet } from "@/types";

import { BalanceInfo, BuyShares } from "./_components";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [sharePrice, setSharePrice] = useState(0);

  const { data: userWallet } = useGetUserWallet();
  const { mutate: updateUserWallet } = useUpdateUserWallet();
  const { data: appSettings } = useGetAppSettings();

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

  useEffect(() => {
    if (appSettings && appSettings.sharePrice)
      setSharePrice(appSettings.sharePrice);
  }, [appSettings]);

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="w-full">
        <h2 className="text-[32px] leading-[44px] font-semibold">Wallet</h2>
        <p className="text-[20px] leading-[27px] font-semibold mt-3">
          Your Earnings & Investments in One Place
        </p>
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
            sharePrice={sharePrice}
            transferBonusToDiscount={transferBonusToDiscount}
            balance={wallet?.sharesAmount || 0}
            balanceType={BalanceType.Shares}
          />
        </div>
        {sharePrice && (
          <div className="flex justify-center mt-10">
            <BuyShares
              sharePrice={sharePrice}
              bonusAmount={wallet?.bonusAmount || 0}
            />
          </div>
        )}
      </div>
    </div>
  );
}
