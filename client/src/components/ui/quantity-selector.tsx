"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  minValue: number;
}

export const QuantitySelector = ({
  value,
  onChange,
  minValue,
}: QuantitySelectorProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const numericValue = Number(newValue);
    if (!isNaN(numericValue)) setInputValue(newValue);
  };

  const handleBlur = () => {
    const numericValue = Number(inputValue);
    if (!isNaN(numericValue) && numericValue >= minValue) {
      onChange(numericValue);
    } else {
      setInputValue(value.toString());
    }
  };

  return (
    <div className="flex items-center rounded-[16px] border border-customWhiteManager px-4 py-2 space-x-4">
      <button
        onClick={() => onChange(Math.max(minValue, value - 1))}
        className="text-white"
      >
        <Minus size={20} />
      </button>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-7 text-center text-white bg-transparent border-none outline-none"
      />
      <button onClick={() => onChange(value + 1)} className="text-white">
        <Plus size={20} />
      </button>
    </div>
  );
};
