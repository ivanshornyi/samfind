/* eslint-disable react-hooks/exhaustive-deps */
"udr client";

import {
  toast,
  useGetAppSettings,
  usePaySubscription,
  useAddUserShareholderData,
} from "@/hooks";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  Button,
  QuantitySelector,
} from "@/components";
import { Check, Info, X } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context";
import { ShareholderType, UserShareholderData } from "@/types";
import { ShareholderForm } from "@/components/shareholder-form";
import { CreatePaymentData } from "@/services";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface EarlyBirdModalProps {
  planId: string;
}

export const EarlyBirdModal = ({ planId }: EarlyBirdModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sharePrice, setSharePrice] = useState(0);
  const [quantity, setQuantity] = useState(6);
  const [stage, setStage] = useState(1);
  const { user } = useContext(AuthContext);

  const initShareholderData = {
    userId: user!.id,
    shareholderType: ShareholderType.Individual,
    firstName: "",
    lastName: "",
    identificationNumber: "",
    email: "",
    address: "",
    postcode: "",
    city: "",
    country: "",
    countryCode: "",
  };
  const [formData, setFormData] =
    useState<Omit<UserShareholderData, "id" | "createdAt" | "updatedAt">>(
      initShareholderData
    );

  const { data: appSettings } = useGetAppSettings();
  const {
    mutate: paySubscriptionMutation,
    isPending: isPaySubscriptionPending,
    isSuccess: isSubscriptionPayed,
  } = usePaySubscription();

  const {
    mutate: addShareholderData,
    isPending: isAddShareholderDataPending,
    isSuccess: isShareholderDataAdded,
  } = useAddUserShareholderData();

  const closeModalAndClearState = useCallback(() => {
    setIsOpen(false);
    setFormData(initShareholderData);
    setStage(1);
    setQuantity(6);
  }, [initShareholderData]);

  const submit = () => {
    if (!user) return;

    if (
      !Object.values(formData).every(
        (value) => value !== "" && value !== null && value !== undefined
      )
    ) {
      toast({
        description: "Some fields are empty",
      });

      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        description: "Invalid email address",
      });
      return;
    }

    addShareholderData(formData);
  };

  const changeQuantity = (val: number) => {
    setQuantity(val < 6 ? 6 : val);
  };

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (appSettings && appSettings.sharePrice)
      setSharePrice(appSettings.sharePrice);
  }, [appSettings]);

  useEffect(() => {
    if (isSubscriptionPayed) closeModalAndClearState();
  }, [isSubscriptionPayed]);

  useEffect(() => {
    if (
      isShareholderDataAdded &&
      Object.values(formData).every(
        (value) => value !== "" && value !== null && value !== undefined
      )
    ) {
      let payment: CreatePaymentData = {
        userId: user!.id,
        planId,
        quantity,
      };

      if (user!.invitedReferralCode) {
        payment = {
          ...payment,
          userReferralCode: user!.invitedReferralCode,
        };
      }

      paySubscriptionMutation(payment);
    }
  }, [isShareholderDataAdded, planId, quantity, user, formData]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"purple"} className="w-full">
          Get started
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="
          w-full max-w-[591px] overflow-auto rounded-none  md:rounded-[30px]
        "
      >
        <div className="absolute right-5 top-5">
          <AlertDialogCancel
            onClick={closeModalAndClearState}
            className="shadow-none border-none p-1 rounded-full bg-card"
          >
            <X size={18} />
          </AlertDialogCancel>
        </div>

        <AlertDialogHeader>
          <AlertDialogTitle className="text-[24px] leading-[33px] font-semibold">
            Buy Shares
          </AlertDialogTitle>
        </AlertDialogHeader>
        {stage === 1 ? (
          <>
            {user?.invitedReferralCode && (
              <div className="my-4 flex items-center gap-2 bg-[#363637] rounded-2xl px-4 py-2">
                <Info color="#BEB8FF" />
                <p className="text-[#BEB8FF]">
                  You&apos;ve got a 10% bonus via referral link!
                </p>
              </div>
            )}
            <div className="flex mt-8 justify-between">
              <div className="flex flex-col items-center">
                <p className="text-[15px] leading-[18px]">Price per 1 share</p>
                <p className="text-[24px] leading-[32px] font-semibold mt-3">
                  €{sharePrice / 100}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[15px] leading-[18px] mb-2">
                  Number of shares
                </p>
                <QuantitySelector
                  value={quantity}
                  onChange={changeQuantity}
                  minValue={6}
                />
              </div>
              <div className="flex flex-col items-center w-[100px]">
                <p className="text-[15px] leading-[18px]">Total</p>
                <p className="text-[24px] leading-[32px] font-semibold mt-3">
                  €{(quantity * sharePrice) / 100}
                </p>
              </div>
            </div>

            <p className="mt-4 text-disabled text-[15px] leading-[22px]">
              Want more? Try increasing your share quantity! Get 1 month
              free for every 6 shares purchased.
            </p>

            <ul className="space-y-4 mt-4 text-[15px] leading-[18px] font-semibold">
              <li className="flex items-center gap-4">
                <Check className="w-4 h-4" />
                <p>
                  <span className="text-[#CE9DF3] mr-2">
                    {Math.floor(quantity / 6)}
                  </span>
                  month of subscription for free!
                </p>
              </li>
              <li className="flex items-center gap-4">
                <Check className="w-4 h-4" />
                <span>
                  You could potentially earn
                  <span className="text-[#CE9DF3] mx-1">
                    €
                    {Math.round(
                      (((sharePrice / 0.01416) * 100) / 100) * 5 * quantity
                    )
                      .toLocaleString("en-US")
                      .replace(/,/g, " ")}
                  </span>
                  if our company reaches just 5% of OpenAI’s value.
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Check className="w-4 h-4" />
                Own shares & benefit from company growth!
              </li>
            </ul>
          </>
        ) : (
          <ShareholderForm formData={formData} updateField={updateField} />
        )}
        <Button
          onClick={() => (stage === 1 ? setStage(2) : submit())}
          variant={"purple"}
          className="w-full mt-8"
          loading={isAddShareholderDataPending || isPaySubscriptionPending}
        >
          {stage === 1 ? "Next" : "Confirm"}
        </Button>

        {stage === 1 && (
          <div className="mt-8">
            <div className="flex gap-2 bg-[#363637] rounded-2xl px-4 py-2">
              <Info color="#CE9DF3" />
              <p className="text-[#CE9DF3]">
                With Early Bird Access, your shares is converted into free
                access to the platform.
              </p>
            </div>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
