import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  FullScreenLoader,
  QuantitySelector,
} from "@/components";
import { AuthContext } from "@/context";
import {
  useActivateSubscription,
  usePaySubscription,
  // useCancelChangeSubscriptionPlan,
} from "@/hooks";
import { CreatePaymentData } from "@/services";
import { Plan, PlanType } from "@/types";
// import { format } from "date-fns";
import { Check } from "lucide-react";
import { useContext, useState } from "react";
import { ChangePlanModal } from "../change-plan-modal";
import { EarlyBirdModal } from "../early-bird-modal/early-bird-modal";

interface PricingCardProps {
  plan: Plan;
  withButton: boolean;
  currentUserPlanId?: string;
  isActive?: boolean;
  subscriptionId?: string;
  nextDate?: string;
  newPlanId?: string;
  closePlansModal?: () => void;
}

const PLAN_FEATURES = {
  standard: {
    features: [
      "Internet Search, Deep research, Advanced online Chat",
      "Access to our platform (web, mobile, desktop)",
      "Premium support",
    ],
    title:
      "Boost your capabilities with premium features and priority support.",
  },
  freemium: {
    features: ["Essential features", "Community access", "Basic support"],
    title: "Essential features for personal and community use",
  },
  earlyBird: {
    features: [
      "All the benefits of a monthly subscription",
      "Free access to our platform (web, mobile, desktop)",
      "The potential to sell shares later for profit",
      "Be part of the company’s growth",
    ],
    title: "6 shares = 1 month of using all Onsio tools for free",
  },
  // Add other plan types if needed
};

export const PricingCard = ({
  plan,
  withButton,
  currentUserPlanId,
  isActive,
  subscriptionId,
  // newPlanId,
  nextDate,
  closePlansModal,
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
  // const {
  //   mutate: cancelChangeSubscriptionPlan,
  //   isPending: isCancelChangeSubscriptionPlan,
  // } = useCancelChangeSubscriptionPlan();

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

  const changeQuantity = (val: number) => {
    setQuantity(val < 1 ? 1 : val);
  };

  return (
    <Card
      className={`relative border-none rounded-3xl overflow-hidden w-full max-w-[360px] flex-1  ${
        plan.price === 225 ? "bg-[#28282C]" : "bg-[#292832]"
      } ${plan.type === PlanType.EarlyBird ? "bg-transparent gradient-border-modal" : ""}`}
    >
      {isPaySubscriptionPending && <FullScreenLoader />}
      <CardHeader className="space-y-4">
        <h3 className="text-2xl font-semibold capitalize">
          {plan.type} {plan.period}
        </h3>
        <p
          className={`${plan.type === PlanType.EarlyBird ? "text-[#CE9DF3]" : "text-[#C4C4C4]"} text-sm max-w-[250px]`}
        >
          {PLAN_FEATURES[plan.type]?.title}
        </p>
      </CardHeader>

      <CardContent>
        <div className="mb-8">
          {withButton && plan.type === PlanType.Standard && (
            <div className="flex items-center gap-2 mt-3">
              <label>Quantity</label>
              <QuantitySelector
                value={quantity}
                onChange={changeQuantity}
                minValue={1}
              />
            </div>
          )}

          <div className="flex items-baseline mt-2">
            <span className="text-4xl font-semibold">
              {formatPrice(plan.price)}
            </span>
            <span className="text-[#C4C4C4] text-sm ml-2">
              {plan.period === "monthly" && <span>/billed monthly</span>}
              {plan.period === "yearly" && <span>/billed yearly</span>}
            </span>
          </div>
        </div>
        {plan.type === PlanType.EarlyBird && (
          <p className="mb-3">Exclusive perks for shareholders:</p>
        )}
        <ul className="space-y-4">
          {PLAN_FEATURES[plan.type]?.features.map((feature) => (
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
              <ChangePlanModal
                nextDate={nextDate}
                subscriptionId={subscriptionId}
                plan={plan}
                closePlansModal={closePlansModal!}
              />
              {/* {newPlanId === plan.id && (
                <p className="mb-2">
                  Selected as new Plan from{" "}
                  {format(new Date(nextDate), "MMMM dd, yyyy")}
                </p>
              )} */}
              {/* {newPlanId === plan.id ? (
                <Button
                  variant={"secondary"}
                  className="w-full"
                  onClick={() => cancelChangeSubscriptionPlan(subscriptionId)}
                  withLoader
                  loading={isCancelChangeSubscriptionPlan}
                >
                  Cancel Select
                </Button>
              ) : (
                <ChangePlanModal
                  nextDate={nextDate}
                  subscriptionId={subscriptionId}
                  plan={plan}
                />
              )} */}
            </div>
          )}
        {withButton && (
          <>
            {plan.type === PlanType.EarlyBird ? (
              <EarlyBirdModal planId={plan.id} />
            ) : (
              <Button
                variant={"secondary"}
                className="w-full"
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
          </>
        )}
      </CardFooter>
    </Card>
  );
};
