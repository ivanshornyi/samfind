import { handleApiError } from "@/errors";

import { apiClient } from "@/vars";

export interface SendSupportEmailData {
  fullName: string;
  email: string;
  category: string;
  message: string;
}

const sendSupportEmail = async (data: SendSupportEmailData) => {
  try {
    await apiClient.post(`/mail/support`, {
      ...data,
    });
  } catch (error) {
    handleApiError(error);
  }
};

export const MailApiService = { sendSupportEmail };
