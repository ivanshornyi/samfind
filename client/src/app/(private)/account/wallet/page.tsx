"use client";

import { useEffect, useState } from "react";
import { useGetAppSettings, useGetUserWallet } from "@/hooks";
import { Wallet } from "@/types";

import { BalanceBonus } from "./_components";
import { BalanceShares } from "./_components/balance-shares";
import { BalanceDiscount } from "./_components/balance-discount";
import { MaximizeInfo } from "./_components/maximize-info";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [sharePrice, setSharePrice] = useState(0);

  const { data: userWallet } = useGetUserWallet();
  const { data: appSettings } = useGetAppSettings();

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
          <BalanceBonus
            balance={wallet?.bonusAmount || 0}
            sharePrice={sharePrice}
          />
          <BalanceShares
            balance={wallet?.sharesAmount || 0}
            sharePrice={sharePrice}
            bonusAmount={wallet?.bonusAmount || 0}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <BalanceDiscount balance={wallet?.discountAmount || 0} />
          <MaximizeInfo />
        </div>
      </div>
    </div>
  );
}
