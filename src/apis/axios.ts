import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
      const parsedToken = JSON.parse(accessToken) as string;
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${parsedToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);

      // refreshToken 도입 시 사용
      // const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
      // if (refreshToken) {
      //   const parsedRefreshToken = JSON.parse(refreshToken) as string;
      //   const { data } = await axios.post(
      //     `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
      //     { refreshToken: parsedRefreshToken }
      //   );
      //
      //   localStorage.setItem(
      //     LOCAL_STORAGE_KEY.accessToken,
      //     JSON.stringify(data.data.accessToken)
      //   );
      //
      //   // localStorage.setItem(
      //   //   LOCAL_STORAGE_KEY.refreshToken,
      //   //   JSON.stringify(data.data.refreshToken)
      //   // );
      //
      //   originalRequest.headers = originalRequest.headers ?? {};
      //   originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      //   return axiosInstance(originalRequest);
      // }

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);