"use client";

import { QuestionItem } from "./question-item";

interface QuestionDataItemProps {
  title: string;
  description: string;
  questions: { question: string; answer: string }[];
}

export function QuestionDataItem({
  title,
  description,
  questions,
}: QuestionDataItemProps) {
  return (
    <div className="flex flex-col sm:flex-row mb-[60px] sm:mb-[100px] w-full sm:gap-[145px] justify-evenly ">
      <div className="w-full sm:w-[334px] pt-2">
        <p className="mb-4 text-[24px] sm:text-[32px] leading-[32px] sm:leading-[44px] font-semibold">
          {title}
        </p>
        <p className="text-[16px] leading-[22px]">{description}</p>
      </div>
      <div>
        {questions.map((q) => (
          <QuestionItem
            key={q.question}
            question={q.question}
            answer={q.answer}
          />
        ))}
      </div>
    </div>
  );
}
