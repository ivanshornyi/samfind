/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from "react";

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

import { Check, CirclePlus, Info, X } from "lucide-react";
import {
  useCreateSharesInvoice,
  useBuyShares,
  useGetUserShareholderData,
  useAddUserShareholderData,
  toast,
} from "@/hooks";
import { PurchaseType } from "@/types/share";
import { AuthContext } from "@/context";
import { ShareholderType, UserShareholderData } from "@/types";
import { ShareholderForm } from "@/components/shareholder-form";
import { SelectComponent } from "@/components/ui/select";

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const orderOptions = [
  {
    value: "Buy",
    label: "Buy",
  },
];

interface BuySharesProps {
  bonusAmount: number;
  sharePrice: number;
  isEarlyBird: boolean;
  fromBonusPage?: boolean;
}

export const BuyShares = ({
  bonusAmount,
  sharePrice,
  fromBonusPage,
  isEarlyBird,
}: BuySharesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bonusSharesQuantity, setBonusSharesQuantity] = useState("");
  const [moneySharesQuantity, setMoneySharesQuantity] = useState("");
  const [stage, setStage] = useState(1);
  const [pending, setPending] = useState(false);
  const [isBonusOpen, setIsBonusOpen] = useState(false);

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

  const { mutate: createInvoice, isPending: isCreateInvoicePending } =
    useCreateSharesInvoice();
  const { mutate: payByBonus, isPending: isPayByBonusPending } = useBuyShares();
  const { data: shareholderData } = useGetUserShareholderData();

  const {
    mutate: addShareholderData,
    isPending: isAddShareholderDataPending,
    isSuccess: isShareholderDataAdded,
  } = useAddUserShareholderData();

  const buyShares = () => {
    if (Number(bonusSharesQuantity) && user) {
      payByBonus({
        quantity: Number(bonusSharesQuantity),
        price: sharePrice,
        userId: user?.id,
        purchaseType: PurchaseType.Bonus,
      });
    }
    if (Number(moneySharesQuantity) && user) {
      createInvoice({
        userId: user.id,
        quantity: Number(moneySharesQuantity),
      });
    }
  };

  const submit = () => {
    if (!user) return;

    if (shareholderData) {
      buyShares();
    } else {
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
    }
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

  const closeModalAndClearState = useCallback(() => {
    setIsModalOpen(false);
    setFormData(initShareholderData);
    setStage(1);
    setBonusSharesQuantity("");
    setMoneySharesQuantity("");
    setPending(false);
    setIsBonusOpen(false);
  }, [initShareholderData]);

  useEffect(() => {
    if (
      (isPayByBonusPending ||
        isCreateInvoicePending ||
        isAddShareholderDataPending) &&
      !pending
    )
      setPending(true);
    if (
      !isPayByBonusPending &&
      !isCreateInvoicePending &&
      !isAddShareholderDataPending &&
      pending
    ) {
      closeModalAndClearState();
    }
  }, [
    pending,
    isPayByBonusPending,
    isCreateInvoicePending,
    isAddShareholderDataPending,
  ]);

  useEffect(() => {
    if (
      isShareholderDataAdded &&
      Object.values(formData).every(
        (value) => value !== "" && value !== null && value !== undefined
      )
    ) {
      buyShares();
    }
  }, [isShareholderDataAdded, formData]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogTrigger className="w-full" asChild>
        <Button
          className="w-full"
          variant={fromBonusPage ? "saveProfile" : "purple"}
          onClick={() => setIsModalOpen(true)}
        >
          {fromBonusPage ? "Convert to Shares" : "Buy Shares"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-full max-w-[590px] max-h-[95vh] overflow-y-auto">
        <div className="absolute right-1 top-1">
          <AlertDialogCancel
            onClick={closeModalAndClearState}
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
        {stage === 1 ? (
          <>
            <div className="flex mt-8 gap-6 items-end">
              <div>
                <p className="text-[16px] leading-[22px]">Latest course</p>
                <p className="text-2xl sm:text-[32px] sm:leading-[43px] font-semibold text-nowrap">
                  €{sharePrice / 100}
                </p>
              </div>
              <div className="flex flex-col gap-1 text-[16px] leading-[22px] text-disabled items-end">
                <div className="flex gap-2">
                  <p> 24H Trend:</p>
                  <p className="text-white"></p>
                </div>
                <div className="flex gap-2">
                  <p>Last update:</p>
                  <p className="text-white"></p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[16px] leading-[22px] text-disabled mb-2">
                Order Type
              </p>
              <SelectComponent
                options={orderOptions}
                value={orderOptions[0]}
                onChange={(value) => console.log(value)}
                optionColor="#00DC2C"
                placeholder="Select order type"
              />
            </div>
            <div className="mt-4 pb-4 border-b border-[#363637]">
              <p className="text-[16px] leading-[22px] text-disabled mb-2">
                {isEarlyBird
                  ? "Quantity (6 shares = 1 month free)"
                  : "Quantity"}
              </p>
              <Input
                name="moneySharesQuantity"
                type="text"
                onBlur={() => {
                  if (moneySharesQuantity === "") {
                    setMoneySharesQuantity("0");
                  }
                }}
                value={moneySharesQuantity}
                onChange={(e) => {
                  const newValue = e.target.value.replace(/\D/g, "");

                  const numericValue =
                    newValue === "" ? 0 : parseInt(newValue, 10);
                  setMoneySharesQuantity(String(Math.max(0, numericValue)));
                }}
              />
            </div>
            <ul className="space-y-4 mt-6 text-[15px] leading-[18px] font-semibold">
              {isEarlyBird ? (
                <li className="flex items-center gap-4">
                  <Check className="w-4 h-4" />
                  <p>
                    <span className="text-[#CE9DF3] mr-2">
                      {Math.floor(Number(moneySharesQuantity) / 6)}
                    </span>
                    month of subscription for free!
                  </p>
                </li>
              ) : null}
              <li className="flex items-center gap-4">
                <Check className="w-4 h-4" />
                <span>
                  You could potentially earn
                  <span className="text-[#CE9DF3] mx-1">
                    €
                    {Math.round(
                      (((sharePrice / 0.01416) * 100) / 100 / 100) *
                        5 *
                        Number(moneySharesQuantity)
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

            <div className="mt-4 pb-4 border-b border-[#363637]">
              {isBonusOpen ? (
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[16px] leading-[22px] font-semibold">
                      Enter the desired quantity of shares
                    </h3>
                    <p
                      className="cursor-pointer underline"
                      onClick={() => setIsBonusOpen(false)}
                    >
                      Close
                    </p>
                  </div>
                  <p className="text-[16px] leading-[22px] text-disabled mt-2">
                    <span className="font-bold">€{bonusAmount / 100}</span>{" "}
                    bonuses Available = {Math.floor(bonusAmount / sharePrice)}{" "}
                    shares max
                  </p>
                  <div className="flex gap-4 items-center mt-2">
                    <Input
                      name="bonusSharesQuantity"
                      type="text"
                      onBlur={() => {
                        if (bonusSharesQuantity === "") {
                          setBonusSharesQuantity("0");
                        }
                      }}
                      value={bonusSharesQuantity}
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/\D/g, "");

                        let numericValue =
                          newValue === "" ? 0 : parseInt(newValue, 10);

                        if (numericValue > Math.floor(bonusAmount / sharePrice))
                          numericValue = Math.floor(bonusAmount / sharePrice);

                        setBonusSharesQuantity(
                          String(Math.max(0, numericValue))
                        );
                      }}
                    />
                    <p
                      onClick={() =>
                        setBonusSharesQuantity(
                          String(Math.floor(bonusAmount / sharePrice))
                        )
                      }
                      className="text-[#CE9DF3] cursor-pointer"
                    >
                      Max
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <p
                    className="flex items-center gap-2 text-[#CE9DF3] cursor-pointer"
                    onClick={() => setIsBonusOpen(true)}
                  >
                    <CirclePlus size={20} />
                    Convert bonuses to shares
                  </p>
                  <Info size={18} className="text-disabled" />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 text-[16px] leading-[22px] font-semibold pb-4 border-b border-[#363637]">
              <div className="flex justify-between">
                <p>Order Value</p>
                <p>
                  €
                  {((Number(moneySharesQuantity) +
                    Number(bonusSharesQuantity)) *
                    sharePrice) /
                    100}
                </p>
              </div>
              <div className="flex justify-between">
                <p>Commission</p>
                <p>€0</p>
              </div>
              <div className="flex justify-between text-[#CE9DF3]">
                <p>Bonuses applied</p>
                <p>
                  {Number(bonusSharesQuantity) > 0
                    ? `-€${(Number(bonusSharesQuantity) * sharePrice) / 100}`
                    : "€0"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-[20px] leading-[27px] font-semibold">
              <div>
                <p>Total Amount</p>
                <p className="text-[16px] leading-[22px] text-disabled">
                  (including fees)
                </p>
              </div>
              <p>€{(Number(moneySharesQuantity) * sharePrice) / 100}</p>
            </div>
          </>
        ) : (
          <ShareholderForm formData={formData} updateField={updateField} />
        )}

        <AlertDialogFooter className="flex mt-4 gap-6 w-full">
          <Button
            onClick={() =>
              stage === 1 && !shareholderData ? setStage(2) : submit()
            }
            variant={"purple"}
            className="w-full"
            loading={pending}
            disabled={
              !Number(bonusSharesQuantity) && !Number(moneySharesQuantity)
            }
          >
            {stage === 1 && !shareholderData ? "Next" : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
