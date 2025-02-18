"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  Button,
} from "@/components";
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export function Chatbot() {
  const [stage, setStage] = useState<
    | "start"
    | "options"
    | "aboutPlatform"
    | "pricingPlans"
    | "pricing"
    | "getStarted"
    | "contact"
    | "chat"
  >("start");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Привіт! Як можу допомогти?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Я ще навчаюсь! Зверніться в підтримку, якщо потрібно.",
          sender: "bot",
        },
      ]);
    }, 1000);
  };

  return (
    <div className={stage !== "start" ? "h-[700px]" : ""}>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-[32px] leading-[44px] font-semibold">
          Hi there!
        </AlertDialogTitle>
        <AlertDialogDescription className="text-[16px] leading-[22px] font-semibold">
          I’m here to help you learn more about our platform.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="mt-6 bg-[#28282C] rounded-[20px] p-4 overflow-auto">
        <div className="flex gap-4">
          <div>
            <Image src="/o.png" alt="icon" width={32} height={32} />
          </div>
          <div className="mb-4">
            <p className="text-[14px] text-disabled leading-[19px] font-semibold">
              Onsio AI bot
            </p>
            <p className="text-[16px] leading-[22px] font-semibold">
              Let me know if you have any questions!
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          variant="purple"
          leftIcon={<Send />}
          onClick={() => setStage("options")}
        >
          Сhat with us
        </Button>
      </div>
    </div>
  );
}
