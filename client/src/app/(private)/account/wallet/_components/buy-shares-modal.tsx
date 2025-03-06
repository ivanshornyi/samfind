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

import { X } from "lucide-react";
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

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface BuySharesProps {
  bonusAmount: number;
  sharePrice: number;
  fromBonusPage?: boolean;
}

export const BuyShares = ({
  bonusAmount,
  sharePrice,
  fromBonusPage,
}: BuySharesProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bonusSharesQuantity, setBonusSharesQuantity] = useState(0);
  const [moneySharesQuantity, setMoneySharesQuantity] = useState(0);
  const [stage, setStage] = useState(1);
  const [pending, setPending] = useState(false);

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
    setBonusSharesQuantity(0);
    setMoneySharesQuantity(0);
    setPending(false);
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
              <p className="text-base md:text-xl font-normal text-nowrap">{`Buy for Bonus - ${bonusAmount / 100}€`}</p>
              <div className="flex items-center justify-start gap-4 mt-4">
                <div className="w-[100px]">
                  <Input
                    name="bonusShares"
                    type="number"
                    max={Math.floor(bonusAmount / sharePrice)}
                    min={0}
                    value={bonusSharesQuantity}
                    onChange={(e) =>
                      setBonusSharesQuantity(Number(e.target.value))
                    }
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
                    onChange={(e) =>
                      setMoneySharesQuantity(Number(e.target.value))
                    }
                  />
                </div>

                <p className="w-[150px]">{`X ${sharePrice / 100}€ = ${(sharePrice * moneySharesQuantity) / 100}€`}</p>
              </div>
            </div>
          </>
        ) : (
          <ShareholderForm formData={formData} updateField={updateField} />
        )}

        <AlertDialogFooter className="flex gap-6 w-full">
          <Button
            onClick={() =>
              stage === 1 && !shareholderData ? setStage(2) : submit()
            }
            variant={"purple"}
            className="w-full"
            loading={pending}
            disabled={!bonusSharesQuantity && !moneySharesQuantity}
          >
            {stage === 1 && !shareholderData ? "Next" : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
