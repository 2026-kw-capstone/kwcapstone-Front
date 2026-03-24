import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from "../hooks/accessToken";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getStoredAccessToken();
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    const isUnauthorized = error.response?.status === 401;
    const isReissueRequest = originalRequest?.url?.includes("/auth/reissue");

    if (isUnauthorized && !originalRequest?._retry && !isReissueRequest) {
      originalRequest._retry = true;

      try {
        const { postReissue } = await import("./auth");
        const response = await postReissue();
        const newAccessToken = response?.result?.accessToken;

        if (!newAccessToken) {
          throw new Error("Failed to get access token from reissue response.");
        }

        setStoredAccessToken(newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (reissueError) {
        clearStoredAccessToken();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(reissueError);
      }
    }

    return Promise.reject(error);
  }
);
