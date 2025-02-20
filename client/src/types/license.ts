export enum LicenseStatus {
  Active = "active",
  Inactive = "inactive",
}

export enum LicenseTierType {
  Freemium = "freemium",
  Standard = "standard",
}

export interface License {
  id: string;
  ownerId: string;
  status: LicenseStatus;
  tierType: LicenseTierType;
  count: number;
  userIds: [];
  availableEmails: string[];
}

export interface LicenseList {
  id: string;
  limit: number;
  tierType: LicenseTierType;
  users: {
    memberId?: string;
    name: string;
    email?: string;
    date: Date;
    licenseId: string;
  }[];
}
