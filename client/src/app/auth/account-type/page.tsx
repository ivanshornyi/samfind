"use client";

import { Button, Card } from "@/components";
import type { UserAccountType } from "@/types";
import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type AccountCard, ACCOUNT_TYPE_CARD_ITEMS } from "./data";

export default function AccountType() {
  const [accountCards, setAccountCards] = useState<AccountCard[]>(
    ACCOUNT_TYPE_CARD_ITEMS
  );
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [accountType, setAccountType] = useState<UserAccountType>(
    ACCOUNT_TYPE_CARD_ITEMS[0].type
  );

  const handleChooseAccountType = (type: UserAccountType) => {
    setAccountCards(
      accountCards.map((item) => ({
        ...item,
        active: item.type === type,
      }))
    );
  };

  useEffect(() => {
    accountCards.map((item) => {
      if (item.active) {
        setIsNextButtonVisible(true);
        setAccountType(item.type);
      }
    });
  }, [accountCards]);

  return (
    <div className="max-w-3xl text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-4">
              Choose your account type
            </h1>
            <p className="mt-4 text-lg">
              Let us know how you&apos;ll be using the platform so we can set
              things up just right for you.
            </p>
          </div>

          <div>
            <ul className="grid md:grid-cols-2 gap-6">
              {accountCards.map((card) => (
                <li
                  key={card.type}
                  onClick={() => handleChooseAccountType(card.type)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`
                      relative bg-[#1E1E1E] border transition-all duration-300
                      ${
                        card.active
                          ? "border-[#CE9DF3] shadow-[0_0_20px_rgba(206,157,243,0.3)]"
                          : "border-gray-800 hover:border-[#CE9DF3]/50"
                      }
                      p-8 rounded-3xl h-full
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="text-[#CE9DF3]">{card.icon}</div>
                        <h3 className="text-[#CE9DF3] text-2xl/7 font-bold uppercase">
                          {card.title}
                          <br />
                          Account
                        </h3>
                      </div>

                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          border transition-colors duration-300
                          ${card.active ? "border-[#CE9DF3]" : "border-gray-700"}
                        `}
                      >
                        {card.active && <Check className="text-[#CE9DF3]" />}
                      </div>
                    </div>

                    <div className="mt-6 text-gray-400">
                      <p className="mb-6 text-base/5">{card.description}</p>
                      <ul className="space-y-4">
                        {card.features?.map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-center text-base/5 gap-3"
                          >
                            <div>
                              <Check className="h-4 w-4 text-[#CE9DF3]" />
                            </div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end mt-4">
            <Link
              href={`/auth/sign-up?accountType=${accountType}`}
              className={`${isNextButtonVisible ? "visible" : "invisible"}`}
            >
              <Button className="bg-white hover:bg-gray-100 text-[#8F40E5] px-8 py-3 rounded-full font-medium">
                Next
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}