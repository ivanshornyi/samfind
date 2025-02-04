import { Plan } from "@/types";

import { apiClient } from "@/vars";

import { handleApiError } from "@/errors";

const getPlans = async () => {
  try {
    const response = await apiClient.get("/plan");

    return response.data as Plan[];
  } catch (error) {
    handleApiError(error);
  }
};

export const PlansApiServices = {
  getPlans,
};