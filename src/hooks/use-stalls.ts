import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StallService } from "@/services/stall.service";
import { notifyError, notifySuccess } from "@/lib/toast";
import { UserModel } from "@/model/stall.model";

export const STALLS_QUERY_KEY = ["stalls"];

export function useStalls() {
  const queryClient = useQueryClient();

  // Fetch stalls query
  const query = useQuery({
    queryKey: STALLS_QUERY_KEY,
    queryFn: async () => {
      const res = await StallService.getStalls();
      if (!res.success) throw new Error(res.message);
      console.log(res.data);
      return res.data || [];
    },
  });

  // Create stall mutation
  const createMutation = useMutation({
    mutationFn: (data: UserModel) => StallService.createStall(data),
    onSuccess: (res) => {
      if (res.success) {
        notifySuccess("Stall created successfully");
        queryClient.invalidateQueries({ queryKey: STALLS_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (error: any) => {
      notifyError(error.message || "Failed to create stall");
    },
  });

  // Update stall mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserModel }) =>
      StallService.updateStall(id, data),
    onSuccess: (res) => {
      if (res.success) {
        notifySuccess("Stall updated successfully");
        queryClient.invalidateQueries({ queryKey: STALLS_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (error: any) => {
      notifyError(error.message || "Failed to update stall");
    },
  });

  // Delete stall mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => StallService.deleteStall(id),
    onSuccess: (res) => {
      if (res.success) {
        notifySuccess("Stall deleted successfully");
        queryClient.invalidateQueries({ queryKey: STALLS_QUERY_KEY });
      } else {
        notifyError(res.message);
      }
    },
    onError: (error: any) => {
      notifyError(error.message || "Failed to delete stall");
    },
  });

  return {
    stallsList: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    createStall: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateStall: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteStall: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    resetPassword: async (id: string) => {
      const res = await StallService.resetPassword(id);
      if (res.success) {
        notifySuccess("Password reset successfully");
        queryClient.invalidateQueries({ queryKey: STALLS_QUERY_KEY });
        return res.data;
      } else {
        notifyError(res.message);
        return null;
      }
    }
  };
}
