import { LicenseManagementType } from "../_types";
import {
  ActiveIcon,
  SettingsIcon,
  SupportIcon,
} from "@public/license-management";

export const LicenseManagementConstants: LicenseManagementType[] = [
  {
    id: 1,
    title: "Active Licenses",
    description: "Stay in control of your subscriptions and payments.",
    actions: [
      "View and manage your subscription",
      "Access billing history",
      "Update payment details",
    ],
    icon: ActiveIcon,
  },
  {
    id: 2,
    title: "License Settings",
    description: "Tailor your license preferences to fit your needs.",
    actions: [
      "Manage preferences",
      "Configure access",
      "Update organization details",
    ],
    icon: SettingsIcon,
  },
  {
    id: 3,
    title: "Support Options",
    description: "Get help when you need it with top-tier support services.",
    actions: [
      "Access documentation",
      "Contact priority support",
      "Schedule consultations",
    ],
    icon: SupportIcon,
  },
];
