import type { signUpSchema } from "./schema";
import type z from "zod";

export type SignUpFormData = z.infer<typeof signUpSchema>;
