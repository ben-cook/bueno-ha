import { z } from "zod";
import { FloatSchema } from "./util/validators";

export const MessageSchema = z
  .object({
    type: z.string(),
    id: FloatSchema,
  })
  .passthrough();

export type Message = z.infer<typeof MessageSchema>;

export function isAuthMessage(message: Message): boolean {
  return message.type === "auth" || message.type === "auth_required";
}
