import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  FullScreenLoader,
} from "@/components";
import { AuthContext } from "@/context";
import {
  useActivateSubscription,
  usePaySubscription,
  useChangeSubscriptionPlan,
  useCancelChangeSubscriptionPlan,
} from "@/hooks";
import { CreatePaymentData } from "@/services";
import { Plan, PlanType } from "@/types";
import { format } from "date-fns";
import { Check } from "lucide-react";
import { useContext, useState } from "react";

interface PricingCardProps {
  plan: Plan;
  withButton: boolean;
  currentUserPlanId?: string;
  isActive?: boolean;
  subscriptionId?: string;
  nextDate?: string;
  newPlanId?: string;
}

const PLAN_FEATURES = {
  standard: [
    "Unlimited projects",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
    "Team collaboration",
  ],
  freemium: ["Essential features", "Community access", "Basic support"],
  // Add other plan types if needed
};

export const PricingCard = ({
  plan,
  withButton,
  currentUserPlanId,
  isActive,
  subscriptionId,
  newPlanId,
  nextDate,
}: PricingCardProps) => {
  const { user } = useContext(AuthContext);
  const {
    mutate: paySubscriptionMutation,
    isPending: isPaySubscriptionPending,
  } = usePaySubscription();
  const {
    mutate: activateSubscriptionMutation,
    isPending: isActivateSubscriptionPending,
  } = useActivateSubscription();
  const {
    mutate: changeSubscriptionPlan,
    isPending: isChangeSubscriptionPlan,
  } = useChangeSubscriptionPlan();
  const {
    mutate: cancelChangeSubscriptionPlan,
    isPending: isCancelChangeSubscriptionPlan,
  } = useCancelChangeSubscriptionPlan();

  const [quantity, setQuantity] = useState(1);

  const isFreemium = plan.price === 0;

  const paySubscription = () => {
    if (!user || isFreemium) return;

    let payment: CreatePaymentData = {
      userId: user.id,
      planId: plan.id,
      quantity,
    };

    if (user.invitedReferralCode) {
      payment = {
        ...payment,
        userReferralCode: user.invitedReferralCode,
      };
    }

    paySubscriptionMutation(payment);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);

    if (newValue < 1 || isNaN(newValue)) {
      setQuantity(1);
    } else {
      setQuantity(newValue);
    }
  };

  const formatPrice = (
    price: number,
    currency: string = "EUR",
    locale: string = "en-US"
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: price % 100 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(price / 100);
  };

  return (
    <Card
      className={`relative border-none rounded-3xl overflow-hidden w-full max-w-[360px] flex-1 ${
        plan.price === 225 ? "bg-[#28282C]" : "bg-[#292832]"
      }`}
    >
      {isPaySubscriptionPending && <FullScreenLoader />}
      <CardHeader className="space-y-4">
        <h3 className="text-2xl font-semibold capitalize">
          {plan.type} {plan.period}
        </h3>
        <p className="text-[#C4C4C4] text-sm">
          {plan.type === PlanType.Freemium
            ? "Essential features for personal and community use"
            : "Boost your capabilities with premium features and priority support."}
        </p>
      </CardHeader>

      <CardContent>
        <div className="mb-8">
          {withButton && (
            <div className="flex items-center gap-2 mt-3">
              <label>Quantity</label>
              <input
                type="number"
                min={1}
                className="w-[80px] rounded-xl px-4 py-2 bg-background text-center"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          )}

          <div className="flex items-baseline mt-2">
            <span className="text-4xl font-semibold">
              {formatPrice(plan.price)}
            </span>
            <span className="text-[#C4C4C4] text-sm ml-2">
              {plan.period === "monthly" && <span>/month</span>}
              {plan.period === "yearly" && <span>/year</span>}
            </span>
          </div>
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

      <CardFooter className="mt-2">
        {currentUserPlanId &&
          currentUserPlanId === plan.id &&
          subscriptionId && (
            <Button
              variant={"secondary"}
              className="w-full"
              onClick={() => activateSubscriptionMutation(subscriptionId)}
              withLoader
              loading={isActivateSubscriptionPending}
              disabled={isActive}
            >
              {isActive ? "Active subscription" : "Activate subscription"}
            </Button>
          )}
        {currentUserPlanId &&
          nextDate &&
          currentUserPlanId !== plan.id &&
          subscriptionId && (
            <div className="w-full">
              {newPlanId === plan.id && (
                <p className="mb-2">
                  Selected as new Plan from{" "}
                  {format(new Date(nextDate), "MMMM dd, yyyy")}
                </p>
              )}
              <Button
                variant={"secondary"}
                className="w-full"
                onClick={() =>
                  newPlanId === plan.id
                    ? cancelChangeSubscriptionPlan(subscriptionId)
                    : changeSubscriptionPlan({
                        planId: plan.id,
                        subscriptionId,
                      })
                }
                withLoader
                loading={
                  isChangeSubscriptionPlan || isCancelChangeSubscriptionPlan
                }
              >
                {newPlanId === plan.id ? "Cancel Select" : "Change Plan"}
              </Button>
            </div>
          )}
        {withButton && (
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
                : "Get started"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
