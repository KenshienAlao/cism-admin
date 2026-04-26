import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { StallModel, UserModel } from "@/model/stall.model";

export const StallService = {
  createStall(entity: Readonly<UserModel>): Promise<ApiResponse<StallModel>> {
    const formData = new FormData();

    Object.entries(entity).forEach(([key, value]) => {
      if (key === "image" && !(value instanceof File)) {
        return;
      }
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    return apiClient.postForm<StallModel>(API_ENDPOINTS.CREATE_STALL, formData);
  },
  updateStall(
    id: string,
    entity: Readonly<UserModel>,
  ): Promise<ApiResponse<StallModel>> {
    const formData = new FormData();
    Object.entries(entity).forEach(([key, value]) => {
      if (key === "id") {
        return;
      }
      if (key === "image" && !(value instanceof File)) {
        return;
      }
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });
    formData.append("id", id);
    return apiClient.putForm<StallModel>(API_ENDPOINTS.UPDATE_STALL, formData);
  },

  getStalls(): Promise<ApiResponse<StallModel[]>> {
    return apiClient.get<StallModel[]>(API_ENDPOINTS.GET_STALLS);
  },

  deleteStall(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${API_ENDPOINTS.DELETE_STALL}?id=${id}`);
  },
};
