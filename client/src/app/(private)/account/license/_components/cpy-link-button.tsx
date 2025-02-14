"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Copy } from "lucide-react";

interface CopyLinkButtonProps {
  handleCopyInvitation: () => void;
}

export const CopyLinkButton = ({
  handleCopyInvitation,
}: CopyLinkButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleCopyInvitation}
            className="text-blue-50 bg-card p-2 rounded-full"
          >
            <Copy size={24} />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          align="center"
          className="p-4 bg-[#232323] rounded-[30px] text-xs font-medium text-[#A8A8A8] normal-case"
        >
          Copy the invitation link
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
