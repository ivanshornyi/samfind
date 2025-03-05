import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export const QuantitySelector = ({
  value,
  onChange,
}: QuantitySelectorProps) => {
  return (
    <div className="flex items-center border border-purple-500 rounded-full px-4 py-2 space-x-4">
      <button onClick={() => onChange(value - 1)} className="text-white">
        <Minus size={20} />
      </button>
      <span className="text-white text-lg font-medium">{value}</span>
      <button onClick={() => onChange(value + 1)} className="text-white">
        <Plus size={20} />
      </button>
    </div>
  );
};
