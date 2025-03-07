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
  isFromNorway?: boolean;
  isSale?: boolean;
  isStaff?: boolean;
  role: UserRole;
  status: UserStatus;
  referralCode: string;
  licenseId?: string;
  stripeCustomerId?: string;
  organizationId?: string;
  invitedReferralCode?: number;
  organization?: Organization;
  languageName?: string;
  languageCode?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  discountAmount: number;
  bonusAmount: number;
  sharesAmount: number;
  createdAt: string;
  updatedAt: string;
}

export enum BalanceType {
  Discount = "discount",
  Bonus = "bonus",
  Shares = "shares",
}

export enum ShareholderType {
  Individual = "individual",
  Company = "company",
}

export interface UserShareholderData {
  id: string;
  userId: string;
  shareholderType: ShareholderType;
  firstName: string;
  lastName: string;
  identificationNumber: string;
  email: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
}
