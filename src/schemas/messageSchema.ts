import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Feedback must be atleast 10 characters." })
    .max(300, { message: "Feedback should be under 300 characters" }),
});
