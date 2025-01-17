export enum LicenseStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface License {
  id: string;
  userId: string;
  status: LicenseStatus;
}
