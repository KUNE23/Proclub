import { z } from 'zod'

const passwordSchema = z.string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

const registerSchema = z.object({
  name: z.string()
    .trim()
    .regex(/^[a-zA-Z\s']+$/, "Name must contain only letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters")
    .refine((value) => value.endsWith('@student.sttcipasung.ac.id'), {
      message: "Email harus menggunakan domain kampus student.sttcipasung.ac.id"
    }),
  password: passwordSchema,
  learningCommitmentAccepted: z.boolean()
    .refine((value) => value === true, {
      message: "Kamu harus menyetujui komitmen menyelesaikan modul."
    })
})

const loginSchema = z.object({
  email: z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters"),
  password: z.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
})

const requestPasswordResetSchema = z.object({
  email: z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters")
})

const resetPasswordSchema = z.object({
  email: z.string()
    .trim()
    .email()
    .min(4, "Email must be at least 4 characters")
    .max(255, "Email must be at most 255 characters"),
  otp: z.string()
    .trim()
    .regex(/^[0-9]{6}$/, "Kode OTP harus 6 digit"),
  password: passwordSchema
})

export { registerSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema }
