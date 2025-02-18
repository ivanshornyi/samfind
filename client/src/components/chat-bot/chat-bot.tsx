"use client";

import { useState } from "react";

import { MessageSquareDot, Send, X } from "lucide-react";
// import { Chatbot } from "./chatbot-logic";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  Button,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components";
import * as Dialog from "@radix-ui/react-dialog";

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
      {/* <AlertDialog open={open} onOpenChange={setOpen}>
        <div
          onClick={() => setOpen(true)}
          className="flex items-center justify-center cursor-pointer w-[60px] h-[60px] bg-[#1F1E20] rounded-3xl shadow-[0px_2px_18.9px_0px_#8F40E5] hover:scale-105 transition"
        >
          <MessageSquareDot size={32} className="text-white" />
        </div>
        <div>
          <AlertDialogContent
            portal
            portal={false}
            className={`fixed ${stage !== "start" ? "h-[700px]" : "h-[300px] bottom-[-1000px]"} bottom-[-350px] min-h-[280px] max-h-full right-[-600px] overflow-auto w-full sm:w-[570px] gradient-border-modal translate-y-0 translate-x-[40%] opacity-100 pb-0`}
          >
            <div className="absolute right-1 top-1">
              <AlertDialogCancel
                onClick={() => {
                  setOpen(false);
                  setStage("start");
                }}
                className="shadow-none border-none p-3"
              >
                <X size={18} />
              </AlertDialogCancel>
            </div>
            <div>
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
          </AlertDialogContent>
        </div>
      </AlertDialog> */}

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
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed bottom-8 right-8 w-full sm:w-[570px] h-auto max-h-[700px] gradient-border-modal p-6 backdrop-blur-2xl bg-black/50">
            <div className="absolute right-1 top-1">
              <Dialog.Close className="shadow-none border-none p-3">
                <X size={18} />
              </Dialog.Close>
            </div>
            <Dialog.Title className="text-[32px] leading-[44px] font-semibold">
              Hi there!
            </Dialog.Title>
            <Dialog.Description className="text-[16px] leading-[22px] font-semibold">
              I’m here to help you learn more about our platform.
            </Dialog.Description>
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
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
