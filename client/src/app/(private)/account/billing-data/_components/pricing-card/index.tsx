import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui";
import { PricingPlan } from "@/types";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: PricingPlan;
}

export const PricingCard = ({ plan }: PricingCardProps) => {
  return (
    <Card
      className={`relative border-none rounded-3xl overflow-hidden ${
        plan.price > 0 ? "bg-[#292832]" : "bg-[#242424]"
      }`}
    >
      {plan.isBestValue && <BestValueBadge />}

      <CardHeader className="space-y-4">
        <h3 className="text-2xl font-semibold">{plan.title}</h3>
        <p className="text-[#C4C4C4] text-sm">{plan.description}</p>
      </CardHeader>

      <CardContent>
        <PriceDisplay plan={plan} />
        <FeaturesList features={plan.features} />
      </CardContent>

      <CardFooter>
        <ActionButton plan={plan} />
      </CardFooter>
    </Card>
  );
};

const BestValueBadge = () => (
  <div className="absolute right-6 top-6 bg-[#383838] px-4 py-1 rounded-full text-sm text-[#A8A8FF]">
    Best value
  </div>
);

const PriceDisplay = ({ plan }: { plan: PricingPlan }) => (
  <div className="mb-8">
    <div className="flex items-baseline">
      <span className="text-4xl font-semibold">
        {plan.price === 0 ? (
          "Free"
        ) : (
          <>
            <span className="text-2xl align-top">$</span>
            {plan.price}
          </>
        )}
      </span>
      {plan.price > 0 && (
        <span className="text-[#C4C4C4] text-sm ml-2">
          /{plan.billingPeriod}
        </span>
      )}
    </div>
  </div>
);

const FeaturesList = ({ features }: { features: string[] }) => (
  <ul className="space-y-4">
    {features.map((feature) => (
      <li key={feature} className="flex items-center text-sm text-[#C4C4C4]">
        <Check className="w-4 h-4 mr-3 text-[#8F40E5]" />
        {feature}
      </li>
    ))}
  </ul>
);

const ActionButton = ({ plan }: { plan: PricingPlan }) =>
  plan.price === 0 ? (
    <Button
      className="w-full bg-transparent border border-[#383838] hover:bg-[#383838] text-white rounded-full"
      variant="outline"
    >
      Active subscription
    </Button>
  ) : (
    <Button className="w-full bg-gradient-to-r from-[#8F40E5] to-[#6E40E5] hover:opacity-90 text-white rounded-full">
      Get started
    </Button>
  );
