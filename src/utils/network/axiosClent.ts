import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { accessTokenKey } from "../consts";

const axiosClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json"
    },
    timeout: 60000,
    withCredentials: false
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(accessTokenKey);
    config.headers = config.headers || {};
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

export default axiosClient;