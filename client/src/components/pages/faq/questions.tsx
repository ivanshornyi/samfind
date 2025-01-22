"use client";

import { Button, Input } from "@/components/ui";
import { QuestionDataItem } from "./questionDataItem";

const questionsData = [
  {
    title: "General Questions",
    description:
      "Learn how to get started and explore available support options.",
    questions: [
      {
        question: "How do I get started?",
        answer: "Download, install, and experience the difference immediately.",
      },
      {
        question: "What support options are available?",
        answer:
          "From community forums to dedicated enterprise support, we've got you covered.",
      },
    ],
  },
  {
    title: "Technical Questions",
    description:
      "Understand system requirements and discover customization possibilities.",
    questions: [
      {
        question: "What are the system requirements?",
        answer:
          "Modern hardware with standard specifications will run smoothly.",
      },
      {
        question: "Can I customize my experience?",
        answer: "Absolutely! Flexibility is at our core.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    description:
      " Discover how your data is protected and how you maintain control.",
    questions: [
      {
        question: "How is my data protected?",
        answer:
          "We employ industry-leading security measures with a focus on privacy.",
      },
      {
        question: "Can I control my data?",
        answer: "You maintain complete control over all your information.",
      },
    ],
  },
];

export const Questions = () => {
  return (
    <div className="flex flex-col items-center justify-center ml-auto mr-auto font-manrope pt-[100px] sm:pt-[200px] mb-[60px] sm:mb-[100px]">
      <div>
        <Button className="text-[#8F40E5]" variant="tetrary">
          Contact us
        </Button>
      </div>

      <h1 className="mt-[25px] text-[32px] sm:text-[48px] leading-[44px] sm:leading-[65px] font-semibold">
        Frequently Asked questions
      </h1>
      <p className="mt-[25px] text-[20px] leading-[27px] text-center">
        Need help with something? Here are our most frequently asked questions
      </p>
      <form className="flex space-x-2 mt-[25px] w-full sm:w-[350px] relative">
        <Input type="text" placeholder="Search" />
        <div className="absolute right-0 top-[2px]">
          <Button
            type="submit"
            variant="secondary"
            icon="right"
            className="w-5"
          ></Button>
        </div>
      </form>
      <p className="mt-[25px] sm:mt-[36px] text-[14px] sm:text-[16px] leading-[19px] sm:leading-[22px] text-center">
        Can’t find an answer? Chat to{" "}
        <span className="underline">our team</span>
      </p>
      <div className="mt-[60px] sm:mt-[100px] mb-[60px] sm:mb-[120px]">
        {questionsData.map((data) => (
          <QuestionDataItem
            key={data.title}
            title={data.title}
            description={data.description}
            questions={data.questions}
          />
        ))}
      </div>
    </div>
  );
};
