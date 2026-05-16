import { apiClient } from "@/config/api.config";
import { API_ENDPOINTS } from "@/config/app.config";
import { ApiResponse } from "@/lib/api";
import { prepareFormData } from "@/lib/utils/formdata";
import { StallModel, UserModel } from "@/model/stall.model";

export const StallService = {
  getStalls: (): Promise<ApiResponse<StallModel[]>> =>
    apiClient.get<StallModel[]>(API_ENDPOINTS.GET_STALLS),
  getStall: (id: string): Promise<ApiResponse<StallModel>> =>
    apiClient.get<StallModel>(`${API_ENDPOINTS.GET_STALL}/${id}`),

  createStall: (entity: Readonly<UserModel>): Promise<ApiResponse<StallModel>> =>
    apiClient.postForm<StallModel>(
      API_ENDPOINTS.CREATE_STALL,
      prepareFormData(entity),
    ),

  updateStall: (
    id: string,
    entity: Readonly<Partial<UserModel>>,
  ): Promise<ApiResponse<StallModel>> =>
    apiClient.putForm<StallModel>(
      `${API_ENDPOINTS.UPDATE_STALL}${id}`,
      prepareFormData(entity),
    ),

  deleteStall: (id: string): Promise<ApiResponse<void>> =>
    apiClient.delete<void>(`${API_ENDPOINTS.DELETE_STALL}${id}`),

  resetPassword: (id: string): Promise<ApiResponse<StallModel>> =>
    apiClient.put<StallModel>(`${API_ENDPOINTS.RESET_PASSWORD}${id}`, {}),
};
