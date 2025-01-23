"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { UserAccountType } from "@/types";

import { Button, Card } from "@/components";

import { Check } from "lucide-react";

const ACCOUNT_TYPE_CARD_ITEMS = [
  {
    type: UserAccountType.Private,
    title: "Personal Account",
    description: "Ideal for individual users: purchase a license for personal use and enjoy seamless access to tools that help you stay productive and achieve your goals.",
    icon: 
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M9 9C10.1935 9 11.3381 8.52589 12.182 7.68198C13.0259 6.83807 13.5 5.69347 13.5 4.5C13.5 3.30653 13.0259 2.16193 12.182 1.31802C11.3381 0.474106 10.1935 0 9 0C7.80653 0 6.66193 0.474106 5.81802 1.31802C4.97411 2.16193 4.5 3.30653 4.5 4.5C4.5 5.69347 4.97411 6.83807 5.81802 7.68198C6.66193 8.52589 7.80653 9 9 9ZM12 4.5C12 5.29565 11.6839 6.05871 11.1213 6.62132C10.5587 7.18393 9.79565 7.5 9 7.5C8.20435 7.5 7.44129 7.18393 6.87868 6.62132C6.31607 6.05871 6 5.29565 6 4.5C6 3.70435 6.31607 2.94129 6.87868 2.37868C7.44129 1.81607 8.20435 1.5 9 1.5C9.79565 1.5 10.5587 1.81607 11.1213 2.37868C11.6839 2.94129 12 3.70435 12 4.5ZM18 16.5C18 18 16.5 18 16.5 18H1.5C1.5 18 0 18 0 16.5C0 15 1.5 10.5 9 10.5C16.5 10.5 18 15 18 16.5ZM16.5 16.494C16.4985 16.125 16.269 15.015 15.252 13.998C14.274 13.02 12.4335 12 9 12C5.5665 12 3.726 13.02 2.748 13.998C1.731 15.015 1.503 16.125 1.5 16.494H16.5Z" 
        />
      </svg>
    ,
    active: false,
  },
  {
    type: UserAccountType.Business,
    title: "Business Account",
    description: "Perfect for teams and organizations: acquire licenses to collaborate efficiently, manage projects effectively, and scale your operations.",
    icon: 
      <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.61198 6.57003C9.08474 6.57003 10.2786 5.37612 10.2786 3.90336C10.2786 2.4306 9.08474 1.23669 7.61198 1.23669C6.13922 1.23669 4.94531 2.4306 4.94531 3.90336C4.94531 5.37612 6.13922 6.57003 7.61198 6.57003Z" stroke="#CE9DF3" strokeWidth="1.28223" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.6133 14.5701C13.6133 11.2564 10.9269 8.57007 7.61328 8.57007C4.29961 8.57007 1.61328 11.2564 1.61328 14.5701" stroke="#CE9DF3" strokeWidth="1.28223" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.61458 14.5701L8.94792 12.9034L7.61458 8.57007L6.28125 12.9034L7.61458 14.5701Z" stroke="#CE9DF3" strokeWidth="1.28223" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ,
    active: false,
  }
];

export default function AccountType() {
  const [accountCards, setAccountCards] = useState(ACCOUNT_TYPE_CARD_ITEMS);
  const [isNextButtonVisible, setIsNextButtonVisible] = useState(false);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE_CARD_ITEMS[0].type);

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