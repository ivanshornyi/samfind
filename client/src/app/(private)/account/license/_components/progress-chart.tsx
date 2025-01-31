import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Info } from "lucide-react";

interface ProgressChartProps {
  currentMembers: number;
  maxMembers: number;
}

export const ProgressChart = ({
  currentMembers,
  maxMembers,
}: ProgressChartProps) => {
  const percentage = (currentMembers / maxMembers) * 100;

  return (
    <div className="flex w-[330px] h-[100px] items-center gap-4 bg-[#242424] p-4 rounded-xl">
      <div className="w-[80px] h-[80px] flex items-center">
        <CircularProgressbar
          value={percentage}
          text={`${currentMembers}/${maxMembers}`}
          styles={buildStyles({
            textSize: "14px",
            textColor: "#FFFFFF",
            pathColor: "#8F40E5",
            trailColor: "#C4C4C4",
          })}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] leading-[22px] font-semibold">
            Group Members
          </h3>
          <Info size={20} className="text-[#C4C4C4]" />
        </div>
        <p className="text-disabled text-[12px] leading-[16px] max-w-[180px]">
          Invite your family or close ones and cover their license fees
          effortlessly.
        </p>
      </div>
    </div>
  );
};
