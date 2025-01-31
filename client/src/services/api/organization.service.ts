import { Organization } from "@/types/organization";

import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

export interface UpdateOrganizationData {
  name?: string;
  domains?: string[];
  VAT?: string;
  businessOrganizationNumber?: string;
  availableEmails?: string[];
}

const updateOrganization = async (id: string, data: UpdateOrganizationData) => {
  try {
    const response = await apiClient.patch(`/organization/${id}`, {
      ...data,
    });

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

const getOrganization = async (id: string) => {
  try {
    const response = await apiClient.get(`/organization/${id}`);

    return response.data as Organization;
  } catch (error) {
    handleApiError(error);
  }
};

export const OrganizationApiService = {
  updateOrganization,
  getOrganization,
};
