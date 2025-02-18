"use client";

import { useState } from "react";

import { MessageSquareDot, Send, X, CircleArrowUp } from "lucide-react";
// import { Chatbot } from "./chatbot-logic";
import Image from "next/image";
import { Button, Input } from "@/components";
import * as Dialog from "@radix-ui/react-dialog";

const options = [
  { name: "What can this platform do?", value: "aboutPlatform" },
  { name: "Pricing & plans", value: "pricingPlans" },
  { name: "Pricing", value: "pricing" },
  { name: "How to get started?", value: "getStarted" },
];

export default function ChatBot() {
  const [open, setOpen] = useState<boolean>(false);
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

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          {!open && (
            <div
              onClick={() => setOpen(true)}
              className="fixed bottom-8 right-8 flex items-center justify-center cursor-pointer w-[60px] h-[60px] bg-[#1F1E20] rounded-3xl shadow-[0px_2px_18.9px_0px_#8F40E5] hover:scale-105 transition"
            >
              <MessageSquareDot size={32} className="text-white" />
            </div>
          )}
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0" />
          <Dialog.Content className="fixed bottom-8 right-8 w-full sm:w-[570px] max-h-[700px] gradient-border-modal p-6 backdrop-blur-2xl rounded-[30px] bg-black/50">
            <div className="absolute right-1 top-1">
              <Dialog.Close
                onClick={() => {
                  setOpen(false);
                  setStage("start");
                }}
                className="shadow-none border-none p-3"
              >
                <X size={18} />
              </Dialog.Close>
            </div>
            <Dialog.Title className="text-[32px] leading-[44px] font-semibold">
              {stage === "start" ? "Hi there!" : "Onsio AI bot"}
            </Dialog.Title>
            {stage === "start" && (
              <Dialog.Description className="text-[16px] leading-[22px] font-semibold">
                I’m here to help you learn more about our platform.
              </Dialog.Description>
            )}
            {stage === "start" && (
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
            )}
            {stage !== "start" && (
              <div className="flex flex-col justify-between h-[528px] mt-5 p-4 border-t border-[#363637]">
                {stage === "options" && (
                  <div className="flex h-full flex-col justify-between">
                    <div className="flex gap-4 items-center max-w-[400px]">
                      <div className="w-[110px] h-[50px] relative">
                        <Image src="/o.png" alt="icon" fill />
                      </div>
                      <p className="text-[16px] leading-[22px] font-semibold">
                        {`Hi! I'm Onsio AI agent. I’m here to help you learn more
                        about our platform. How could I help you?`}
                      </p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {options.map((o) => (
                        <Button
                          key={o.value}
                          variant="secondary"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onClick={() => setStage(o.value as any)}
                        >
                          {o.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6 h-[60px] bg-[#28282C] rounded-[20px] p-4 overflow-auto flex items-center space-x-2 w-full relative">
                  <Input type="text" placeholder="Type your question here..." />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer">
                    <CircleArrowUp style={{ width: "24px", height: "24px" }} />
                  </div>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
