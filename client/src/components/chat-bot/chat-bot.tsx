"use client";

import { useEffect, useRef, useState } from "react";

import {
  MessageSquareDot,
  Send,
  X,
  CircleArrowUp,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { Button, Input } from "@/components";
import * as Dialog from "@radix-ui/react-dialog";
import { ContactForm } from "./contact-form";
import { usePathname } from "next/navigation";

const options = [
  { name: "What can this platform do?", value: "aboutPlatform" },
  { name: "Pricing & plans", value: "pricingPlans" },
  { name: "Pricing", value: "pricing" },
  { name: "How to get started?", value: "getStarted" },
];

export default function ChatBot() {
  const [open, setOpen] = useState<boolean>(false);
  const [stage, setStage] = useState<"start" | "contact" | "chat">("start");
  const [option, setOption] = useState<
    "" | "aboutPlatform" | "pricingPlans" | "pricing" | "getStarted"
  >("");
  const [messages, setMessages] = useState<
    { who: "bot" | "user"; text: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("invest")) setStage("contact");
  }, [pathname]);

  useEffect(() => {
    if (stage !== "chat" || (!messages.length && !option)) return;
    if (timer) clearTimeout(timer);
    if (showQuestions) setShowQuestions(false);

    const newTimer = setTimeout(() => {
      setShowQuestions(true);
    }, 15000);

    setTimer(newTimer);

    return () => clearTimeout(newTimer);
  }, [inputText, stage, option, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, option, showQuestions, open]);

  const onClickThankYou = () => {
    setStage("start");
    setMessages([]);
    setOption("");
    setOpen(false);
    setShowQuestions(false);
  };

  const onClickSent = () => {
    if (!inputText) return;

    setMessages((prevState) => [
      ...prevState,
      {
        who: "user",
        text: inputText,
      },
    ]);

    setInputText("");
  };

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
          <Dialog.Content className="z-20 fixed bottom-8 right-0 sm:right-8 w-full sm:w-[570px] max-h-[700px] p-6 backdrop-blur-2xl rounded-[30px] bg-black/30">
            <div className="absolute right-1 top-1">
              <Dialog.Close
                onClick={() => {
                  setOpen(false);
                }}
                className="shadow-none border-none p-3"
              >
                <X size={18} />
              </Dialog.Close>
            </div>
            {stage === "contact" && (
              <div
                onClick={() => setStage("chat")}
                className="absolute left-5 top-5 cursor-pointer"
              >
                <ArrowLeft size={18} />
              </div>
            )}
            <Dialog.Title
              className={`text-[24px] leading-[32px] font-semibold ${stage === "contact" ? "text-center" : ""}`}
            >
              {stage === "start"
                ? "Hi there!"
                : stage === "chat"
                  ? "Onsio AI bot"
                  : "Contact form"}
            </Dialog.Title>
            {stage === "start" && (
              <Dialog.Description className="text-[16px] leading-[22px] font-semibold">
                I’m here to help you learn more about our platform.
              </Dialog.Description>
            )}
            {stage === "start" && (
              <div className="mt-6 bg-[#28282C] rounded-[20px] p-4 overflow-auto">
                <div className="flex gap-4">
                  <div className="w-[40px] h-[37px] relative">
                    <Image src="/o.png" alt="icon" fill />
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
                  onClick={() => setStage("chat")}
                >
                  Сhat with us
                </Button>
              </div>
            )}
            {stage === "chat" && (
              <div>
                <div className="flex flex-col justify-between h-[528px] mt-5 p-4 border-t border-[#363637]">
                  <div
                    className="flex flex-col justify-between overflow-y-auto h-[450px] max-h-[450px] relative
                  "
                  >
                    <div className="flex gap-4 items-start max-w-[400px]">
                      <div className="w-[40px] h-[37px] relative">
                        <Image src="/o.png" alt="icon" fill />
                      </div>
                      <p className="text-[16px] leading-[22px] font-semibold max-w-[350px]">
                        {`Hi! I'm Onsio AI agent. I’m here to help you learn more
                        about our platform. How could I help you?`}
                      </p>
                    </div>
                    {!option && !messages.length && (
                      <div className="flex gap-4 flex-wrap">
                        {options.map((o) => (
                          <Button
                            key={o.value}
                            variant="secondary"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onClick={() => setOption(o.value as any)}
                          >
                            {o.name}
                          </Button>
                        ))}
                      </div>
                    )}
                    {option && (
                      <div>
                        <div className="flex justify-end">
                          <p className="text-[16px] leading-[22px] font-semibold text-right mb-4 bg-[#28282C] rounded-[20px] p-3 px-6 inline-block">
                            {options.find((o) => o.value === option)?.name}
                          </p>
                        </div>
                        <div className="flex gap-4 items-start max-w-[400px]">
                          <div className="w-[40px] h-[37px] relative">
                            <Image src="/o.png" alt="icon" fill />
                          </div>
                          <p className="text-[16px] leading-[22px] font-semibold max-w-[350px]">
                            Benefits of a Business Account for Users: Enhanced
                            capabilities: Access additional features that help
                            you manage your business more effectively and make
                            the most out of the platform. Priority updates: Be
                            among the first to receive new features and
                            improvements, keeping your business ahead of the
                            curve. Premium support: Enjoy access to top-tier
                            support that quickly addresses any issues and
                            ensures your business operates smoothly.
                          </p>
                        </div>
                      </div>
                    )}
                    {messages.length ? (
                      <div>
                        {messages.map((message) => (
                          <div key={message.text}>
                            {message.who === "user" ? (
                              <div className="flex justify-end">
                                <p className="text-[16px] leading-[22px] font-semibold text-right mb-4 max-w-[400px]  bg-[#28282C] rounded-[20px] p-3 px-6 inline-block">
                                  {message.text}
                                </p>
                              </div>
                            ) : (
                              <div className="flex gap-4 items-start max-w-[400px]">
                                <div className="w-[40px] h-[37px] relative">
                                  <Image src="/o.png" alt="icon" fill />
                                </div>
                                <p className="text-[16px] leading-[22px] font-semibold max-w-[350px]">
                                  {message.text}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {showQuestions && (
                      <div className="mt-6 bg-[#28282C] rounded-[20px] p-4">
                        <p className="text-[16px] leading-[22px] font-semibold">
                          Did you find the answer to your question?
                        </p>

                        <div className="flex gap-4 justify-between mt-4">
                          <Button
                            className="w-full"
                            variant="saveProfile"
                            onClick={() => setStage("contact")}
                          >
                            Contact support
                          </Button>
                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={onClickThankYou}
                          >
                            Yes, thank you!
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0" ref={messagesEndRef} />
                  </div>

                  <div className="mt-6 h-[60px] bg-[#28282C] rounded-[20px] p-4 flex items-center space-x-2 w-full relative overflow-hidden">
                    <Input
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onClickSent();
                        }
                      }}
                      type="text"
                      className="pr-11"
                      placeholder="Type your question here..."
                    />
                    <div
                      onClick={onClickSent}
                      className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <CircleArrowUp
                        style={{ width: "24px", height: "24px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {stage === "contact" && (
              <ContactForm afterSubmit={onClickThankYou} />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
