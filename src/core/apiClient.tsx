import axios, { AxiosResponse } from "axios";
import dotenv from "dotenv";

// Create an instance of axios with some default configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Define a generic API function
const apiRequest = async function <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: any,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient({
    method,
    url,
    data,
  });

  return response.data;
};

export default apiRequest;
