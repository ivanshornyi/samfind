import { UserAuthType } from "src/modules/user/types/user";

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  refreshToken: string;
  password: string;
  auth: UserAuthType;
  resetCode?: string;
  resetCodeExpiresAt?: number;
};