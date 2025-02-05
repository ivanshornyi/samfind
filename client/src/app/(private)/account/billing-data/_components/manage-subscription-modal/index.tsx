import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { CancelSubscriptionModal } from "../cancel-subscription-modal";

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlanOption {
  title: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
  isActive?: boolean;
  isBestValue?: boolean;
}

const plans: PlanOption[] = [
  {
    title: "Monthly",
    description:
      "Boost your capabilities with premium features and priority support.",
    price: 19.99,
    billingPeriod: "month, billed monthly",
    features: ["Enhanced capabilities", "Priority updates", "Premium support"],
    isActive: true,
  },
  {
    title: "Yearly",
    description:
      "Boost your capabilities with premium features and priority support.",
    price: 9.99,
    billingPeriod: "month, billed yearly",
    features: ["Enhanced capabilities", "Priority updates", "Premium support"],
    isBestValue: true,
  },
];

export const ManageSubscriptionModal = ({
  isOpen,
  onClose,
}: ManageSubscriptionModalProps) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelSubscription = () => {
    // Handle the actual cancellation logic here
    setIsCancelModalOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#1E1E1E] border-none text-white max-w-[900px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold">
                Manage subscription
              </DialogTitle>
              <Button variant="ghost" className="w-8 h-8 p-0" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[#C4C4C4] mt-2">
              Choose the plan that fits your needs
            </p>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 mt-6">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className="relative bg-[#292832] rounded-3xl p-6"
              >
                {plan.isBestValue && (
                  <div className="absolute right-6 top-6 bg-[#383838] px-4 py-1 rounded-full text-sm text-[#A8A8FF]">
                    Best value
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-2">{plan.title}</h3>
                <p className="text-[#C4C4C4] text-sm mb-6">
                  {plan.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold">
                      <span className="text-2xl">$</span>
                      {plan.price}
                    </span>
                    <span className="text-[#C4C4C4] text-sm ml-2">
                      /{plan.billingPeriod}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center text-sm text-[#C4C4C4]"
                    >
                      <Check className="w-4 h-4 mr-3 text-[#8F40E5]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-full ${
                    plan.isActive
                      ? "bg-transparent border border-[#383838] hover:bg-[#383838]"
                      : "bg-gradient-to-r from-[#8F40E5] to-[#6E40E5] hover:opacity-90"
                  }`}
                  variant={plan.isActive ? "outline" : "default"}
                >
                  {plan.isActive ? "Active subscription" : "Get started"}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              className="text-[#FF6C6C] hover:text-[#FF6C6C] hover:bg-transparent p-0"
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
      />
    </>
  );
};
