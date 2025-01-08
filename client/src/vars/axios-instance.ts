import axios from "axios";

export const apiPath = process.env.NEXT_PUBLIC_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiPath,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
