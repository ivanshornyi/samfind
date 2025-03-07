"use client";

import { Button, Input } from "@/components";
import { toast } from "@/hooks";
import { useSendSupportEmail } from "@/hooks/api/mail";
import { Send } from "lucide-react";
import React, { useEffect, useState } from "react";

const options = [
  { label: "Investment Opportunities", value: "Investment Opportunities" },
  { label: "Support & Technical", value: "Support & Technical" },
  { label: "Payment & Invoicing", value: "Payment & Invoicing" },
  { label: "General Questions", value: "General Questions" },
];

interface ContactFormProps {
  afterSubmit: () => void;
}

export const ContactForm = ({ afterSubmit }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: options[0].value,
    message: "",
  });

  const {
    mutate: sendSupportEmail,
    isSuccess,
    isPending,
  } = useSendSupportEmail();

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.category ||
      !formData.message
    ) {
      toast({
        description: "Please fill in all fields",
      });

      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast({
        description: "Please enter a valid email address",
      });

      return;
    }

    sendSupportEmail(formData);
  };

  useEffect(() => {
    if (isSuccess) afterSubmit();
  }, [afterSubmit, isSuccess]);

  return (
    <div className="mt-5 p-4 border-t border-[#363637]">
      <div>
        <p className="text-[20px] leading-[27px] font-semibold">Contact info</p>
        <Input
          className="mt-4"
          id="fullName"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleFormInputChange}
        />
        <Input
          className="mt-2"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleFormInputChange}
        />
      </div>
      <div className="mt-6">
        <p className="text-[20px] leading-[27px] font-semibold">
          Request category
        </p>
        <div className="flex flex-col gap-2 mt-4">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={option.value}
                checked={formData.category === option.value}
                onChange={handleFormInputChange}
                className="peer hidden"
              />
              <div className="w-5 h-5 border-2 border-[#A64CE8] rounded-full flex items-center justify-center ">
                <div
                  className={`w-2.5 h-2.5 ${formData.category === option.value ? "bg-[#A64CE8]" : "bg-transparent"} rounded-full peer-checked:bg-transparent`}
                ></div>
              </div>
              <span className="peer-checked:text-[#A64CE8] text-[16px] leading-[22px] font-semibold">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4 mb-4">
        <p className="text-[20px] leading-[27px] font-semibold">Message</p>
        <Input
          className="mt-4"
          id="message"
          name="message"
          placeholder="Please describe your request in more detail"
          value={formData.message}
          onChange={handleFormInputChange}
        />
      </div>
      <Button
        className="w-full"
        variant="purple"
        leftIcon={<Send />}
        onClick={handleSubmit}
        loading={isPending}
      >
        Send
      </Button>
    </div>
  );
};
