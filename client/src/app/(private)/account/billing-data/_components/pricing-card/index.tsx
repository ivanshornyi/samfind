import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui";
import { AuthContext } from "@/context";
import { usePaySubscription } from "@/hooks";
import { CreatePaymentData } from "@/services";
import { Plan } from "@/types";
import { Check, Minus, Plus } from "lucide-react";
import { useContext, useState } from "react";

interface PricingCardProps {
  plan: Plan;
}

const PLAN_FEATURES = {
  standard: [
    "Unlimited projects",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
    "Team collaboration",
  ],
  // Add other plan types if needed
};

export const PricingCard = ({ plan }: PricingCardProps) => {
  const { user } = useContext(AuthContext);
  const {
    mutate: paySubscriptionMutation,
    isPending: isPaySubscriptionPending,
  } = usePaySubscription();

  const isFreemium = plan.price === 0;
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const paySubscription = () => {
    if (!user || isFreemium) return;

    let payment: CreatePaymentData = {
      userId: user.id,
      planId: plan.id,
      quantity: quantity,
    };

    if (user.invitedReferralCode) {
      payment = {
        ...payment,
        userReferralCode: user.invitedReferralCode,
        discount: {
          amount: 10,
          description: "",
        },
      };
    }

    paySubscriptionMutation(payment);
  };

  const formatPrice = (price: number) => {
    if (plan.period === "yearly") {
      return (price / 100 / 12).toFixed(2);
    }
    return (price / 100).toFixed(2);
  };

  return (
    <Card
      className={`relative border-none rounded-3xl overflow-hidden ${
        plan.price === 225 ? "bg-[#28282C]" : "bg-[#292832]"
      }`}
    >
      <CardHeader className="space-y-4">
        <h3 className="text-2xl font-semibold capitalize">
          {plan.type} {plan.period}
        </h3>
        <p className="text-[#C4C4C4] text-sm">
          Boost your capabilities with premium features and priority support.
        </p>
      </CardHeader>

      <CardContent>
        <div className="mb-8">
          <div className="flex items-baseline">
            <span className="text-4xl font-semibold">
              <span className="text-2xl align-top">$</span>
              {formatPrice(plan.price)}
            </span>
            <span className="text-[#C4C4C4] text-sm ml-2">
              /month
              {plan.period === "yearly" && (
                <span>, billed ${(plan.price / 100).toFixed(2)} yearly</span>
              )}
            </span>
          </div>
          {!isFreemium && (
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm text-[#C4C4C4]">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseQuantity}
                  className="p-1 rounded-full hover:bg-[#383838] disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-1 rounded-full hover:bg-[#383838]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <ul className="space-y-4">
          {PLAN_FEATURES[plan.type]?.map((feature) => (
            <li
              key={feature}
              className="flex items-center text-sm text-[#C4C4C4]"
            >
              <Check className="w-4 h-4 mr-3 text-[#8F40E5]" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full rounded-full ${
            isFreemium
              ? "bg-transparent border border-[#383838] text-white"
              : "bg-gradient-to-r from-[#8F40E5] to-[#6E40E5] hover:opacity-90 text-white"
          }`}
          onClick={paySubscription}
          disabled={isPaySubscriptionPending || isFreemium}
        >
          {isFreemium
            ? "Active subscription"
            : isPaySubscriptionPending
              ? "Processing..."
              : `Get started${quantity > 1 ? ` (${quantity})` : ""}`}
        </Button>
      </CardFooter>
    </Card>
  );
};
