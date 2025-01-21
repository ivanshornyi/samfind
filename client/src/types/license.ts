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
}
