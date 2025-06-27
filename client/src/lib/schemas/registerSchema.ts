import z from "zod";

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
)

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().regex(passwordValidation, {
    message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
  })
});

export type RegisterSchema = z.infer<typeof registerSchema>;