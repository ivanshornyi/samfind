import { LicenseTierType } from "./license";

export * from "./license";
export * from "./plan";
export * from "./plans";
export * from "./user";

export interface License {
  limit: number;
  tierType: LicenseTierType;
  _count: {
    activeLicenses: number;
  };
  availableEmails: string[];
}
