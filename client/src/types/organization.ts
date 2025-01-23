export interface Organization {
  id: string;
  ownerId: string;
  name: string;
  VAT: string;
  businessOrganizationNumber: string;
  userIds: string[];
  domain?: string;
}