import { UserAccountType } from "@/types";
import { BuildingIcon, UserIcon } from "lucide-react";
import type React from "react";

export interface AccountCard {
  type: UserAccountType;
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  features: string[];
  price: {
    monthly: number;
    yearly: number;
  };
  benefits: string[];
  recommendedFor: string[];
}

export const ACCOUNT_TYPE_CARD_ITEMS: AccountCard[] = [
  {
    type: UserAccountType.Private,
    title: "Personal",
    description:
      "Ideal for individual users: purchase a license for personal use and enjoy seamless access to tools that help you stay productive and achieve your goals.",
    icon: <UserIcon className="h-6 w-6" />,
    active: true,
    features: [
      "Share your subscription and split the benefits",
      "Earn bonuses by inviting others",
      "Manage your licenses",
    ],
    price: {
      monthly: 19.99,
      yearly: 9.99,
    },
    benefits: [
      "Enhanced capabilities",
      "Priority updates",
      "Premium support",
      "Share subscription",
      "Earn bonuses",
    ],
    recommendedFor: [
      "Individual users",
      "Freelancers",
      "Small projects",
      "Personal use",
    ],
  },
  {
    type: UserAccountType.Business,
    title: "Business",
    description:
      "Perfect for teams and organizations: acquire licenses to collaborate efficiently, manage projects effectively, and scale your operations.",
    icon: <BuildingIcon className="h-6 w-6" />,
    active: false,
    features: [
      "License Sharing Under Your Domain",
      "Consolidated payments for multiple licenses with transparent tracking",
      "Priority customer service",
    ],
    price: {
      monthly: 49.99,
      yearly: 39.99,
    },
    benefits: [
      "All Personal features",
      "Team collaboration",
      "Advanced security",
      "Custom integrations",
      "Dedicated support",
    ],
    recommendedFor: [
      "Teams & Organizations",
      "Enterprise projects",
      "Business operations",
      "Large scale deployments",
    ],
  },
];