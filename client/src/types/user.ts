export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum UserRole {
  Admin = "admin",
  Customer = "customer",
}

export enum UserAuthType {
  Email = "email",
  Google = "google",
}

export enum UserAccountType {
  Private = "private",
  Business = "business",
}

export interface Organization {
  name: string;
  businessOrganizationNumber: string;
  VAT: string;
  domains?: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  authType: UserAuthType;
  accountType: UserAccountType;
  role: UserRole;
  status: UserStatus;
  referralCode: string;
  licenseId?: string;
  stripeCustomerId?: string;
  organizationId?: string;
  invitedReferralCode?: number;
  organization?: Organization;
}

export interface Wallet {
  id: string;
  userId: string;
  discountAmount: number;
  bonusAmount: number;
  sharesAmount: number;
  selectedBonusToDiscount: number;
  createdAt: string;
  updatedAt: string;
}
