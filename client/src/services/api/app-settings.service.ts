import { handleApiError } from "@/errors";

import { apiClient } from "@/vars";
import { AppSettings } from "@/types/appSettings";

const getAppSettings = async () => {
  try {
    const response = await apiClient.get(`/app-settings`);

    return response.data as AppSettings;
  } catch (error) {
    handleApiError(error);
  }
};

export const AppSettingsApiService = {
  getAppSettings,
};
