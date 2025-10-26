import axios, { AxiosResponse } from "axios";

// Create an instance of axios with some default configuration
const apiClient = (token?: string) =>
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

// Define a generic API function
const apiRequest = async function <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  token?: string,
  data?: any,
): Promise<T> {
  const response: AxiosResponse<T> = await apiClient(token)({
    method,
    url,
    data,
  });

  return response.data;
};

export default apiRequest;
