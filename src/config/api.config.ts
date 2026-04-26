import { ApiResponse } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const isFormData = options.body instanceof FormData;
  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const result = isJson ? await response.json() : null;

    if (!response.ok) {
      return {
        data: null,
        status: response.status,
        message: result?.message || "Something went wrong",
        success: false,
      };
    }

    return {
      data: result.data as T,
      message: result.message,
      status: response.status,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      status: 500,
      message: error.message || "Something went wrong",
      success: false,
    };
  }
}

export const apiClient = {
  post: <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),

  postForm: <T>(url: string, formData: FormData) =>
    request<T>(url, { method: "POST", body: formData }),

  get: <T>(url: string) => request<T>(url, { method: "GET" }),

  put: <T>(url: string, body: any) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),

  putForm: <T>(url: string, formData: FormData) =>
    request<T>(url, { method: "PUT", body: formData }),

  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
