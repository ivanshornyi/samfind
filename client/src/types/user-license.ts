export enum UserLicenseStatus {
  Active = "active",
  Inactive = "inactive",
}

export interface UserLicense {
  id: string;
  userId: string;
  name: string;
  key: string;
  status: UserLicenseStatus;
}
