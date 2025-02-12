export interface Organization {
  id: string;
  ownerId: string;
  name: string;
  VAT: string;
  businessOrganizationNumber: string;
  userIds: string[];
  domains: string[];
  availableEmails: string[];
}
