import { Button } from "@/components/ui";
import { User, Users } from "lucide-react";
import { AccountType } from "../pricing-plans/index";

interface AccountTypeSelectorProps {
  accountType: AccountType;
  onAccountTypeChange: (type: AccountType) => void;
}

export const AccountPlanSelector = ({
  accountType,
  onAccountTypeChange,
}: AccountTypeSelectorProps) => {
  return (
    <div className="flex items-center gap-2 bg-[#242424] p-1 rounded-full">
      <AccountPlanButton
        type="personal"
        isActive={accountType === "personal"}
        onClick={() => onAccountTypeChange("personal")}
        icon={<User size={16} />}
        label="Personal Account"
      />
      <AccountPlanButton
        type="business"
        isActive={accountType === "business"}
        onClick={() => onAccountTypeChange("business")}
        icon={<Users size={16} />}
        label="Business Account"
      />
    </div>
  );
};

interface AccountTypeButtonProps {
  type: AccountType;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const AccountPlanButton = ({
  isActive,
  onClick,
  icon,
  label,
}: AccountTypeButtonProps) => (
  <Button
    variant="ghost"
    className={`rounded-full flex hover:!bg-[#383838] items-center gap-2 text-[#A8A8FF] hover:text-[#A8A8FF] ${
      isActive ? "bg-[#383838]" : "hover:bg-transparent"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </Button>
);
