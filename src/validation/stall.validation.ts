import z from "zod";

export const CreateStallShema = z.object({
  name: z.string().min(1, "Stall name is required"),
  description: z.string().optional(),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  openAt: z.string().min(1, "Opening time is required"),
  closeAt: z.string().min(1, "Closing time is required"),
});
