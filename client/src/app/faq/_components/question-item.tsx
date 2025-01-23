"use client";

import { Button } from "@/components/ui";
import { useState } from "react";

interface QuestionItemProps {
  question: string;
  answer: string;
}

export function QuestionItem({ question, answer }: QuestionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-[#444444] py-4 w-full  sm:w-[690px]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{question}</h2>

        <Button
          variant="tetrary"
          icon={isOpen ? "minus" : "plus"}
          onClick={toggle}
          className="w-10"
        ></Button>
      </div>

      <div
        className={`
          overflow-hidden
          transition-all
          duration-300
          ${isOpen ? "max-h-[30px]" : "max-h-0"}
        `}
      >
        <p className="mt-2 text-gray-300">{answer}</p>
      </div>
    </div>
  );
}
