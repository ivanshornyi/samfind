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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  authType: UserAuthType;
  role: UserRole;
  status: UserStatus;
  emailResetCode: string | null;
  emailResetCodeExpiresAt: Date | null;
  discount: number;
  referralCode: number;
}
