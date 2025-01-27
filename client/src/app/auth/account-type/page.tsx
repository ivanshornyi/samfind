"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";

import { UserAccountType } from "@/types";

import { Button, Card } from "@/components";

import { Check } from "lucide-react";

import { AccountCard, ACCOUNT_TYPE_CARD_ITEMS } from "./data";

export default function AccountType() {
  const [accountCards, setAccountCards] = useState<AccountCard[]>(ACCOUNT_TYPE_CARD_ITEMS);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [accountType, setAccountType] = useState<UserAccountType>(ACCOUNT_TYPE_CARD_ITEMS[0].type);

  const handleChooseAccountType = (type: UserAccountType) => {
    setAccountCards(accountCards.map(item => {
      return item.type === type ? { ...item, active: true } : { ...item, active: false };
    }));
  };

  useEffect(() => {
    accountCards.map(item => {
      if (item.active) {
        setIsNextButtonVisible(true);
        setAccountType(item.type);
      }
    });
  }, [accountCards]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-bold text-[32px]">Choose your account type</h1>
        <p className="mt-4">Let us know how you’ll be using the platform so we can set things up just right for you.</p>
      </div>
      <div>
        <ul className="flex items-center gap-5">
          {accountCards.map(card => (
            <li 
              key={card.type}
              onClick={() => handleChooseAccountType(card.type)}
              className={`${!card.active && "transition-all duration-80 hover:opacity-80"} cursor-pointer`}
            >
              <Card 
                className={`
                  ${card.active ? "border-violet-50" : "border-transparent"} 
                  border p-8 rounded-[32px] md:w-[358px]
                `}
              >
                <div className="flex justify-between items-center text-violet-50">
                  <div className="flex items-center gap-4">
                    <div>{card.icon}</div>
                    <p className="uppercase text-2xl w-[100px] font-bold leading-6">{card.title}</p>
                  </div>

                  <div
                    className={`
                      ${card.active ? "bg-background" : "bg-transparent"} w-10 h-10 
                      rounded-full flex items-center justify-center border border-violet-50
                    `}
                  >
                    {card.active && <Check />}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="leading-5">{card.description}</p>
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
          <Button className="w-[100px]">Next</Button>
        </Link>
      </div>
    </div>
  );
}