import { StaticImageData } from "next/image";

export type LicenseManagementType = {
  id: number;
  title: string;
  description: string;
  actions: string[];
  icon: StaticImageData;
};
