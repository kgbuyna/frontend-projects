import { AxiosResponse } from "axios";
import axiosClient from "./axiosClent";

export interface ApiResponse<T> {
  status?: "success" | "error"; // Indicates if the operation was successful
  message: string; // Brief message for the client
  data?: T; // Optional: Contains the response data for successful operations
  error?: {
    code: number; // Application-specific error code
    details: string; // Detailed error description
  }; // Optional: Contains error information
}

async function postRequest<T>(
  url: string,
  data: object,
  config = {}
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosClient().post(
      url,
      data,
      config
    );
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw new Error(error);
  }
}

async function getRequest<T>(
  url: string,
  config = {}
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosClient().get(
      url,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw new Error();
  }
}

async function deleteRequest<T>(
  url: string,
  config = {}
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosClient().delete(
      url,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    throw new Error();
  }
}

export { postRequest, getRequest, deleteRequest };
