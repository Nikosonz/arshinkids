import { z } from "zod";

/**
 * Shared Zod schemas (client form + API route). Persian error messages.
 */

// Iranian mobile/landline-ish: digits, +98, spaces, dashes. Loose on purpose.
const phoneRegex = /^[+\d][\d\s\-()]{6,18}$/;

export const enrollSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "نام را وارد کنید")
    .max(80, "نام طولانی است"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "شماره تماس معتبر نیست"),
  childName: z.string().trim().max(80).optional().or(z.literal("")),
  // Kept as a string so the form input and parsed output types match (RHF +
  // zodResolver). Persian digits are normalized + range-checked in the API.
  childBirthYear: z.string().trim().max(8).optional().or(z.literal("")),
  program: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000, "متن طولانی است").optional().or(z.literal("")),
  // honeypot — must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnrollInput = z.infer<typeof enrollSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("ایمیل معتبر نیست"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

// --- customer (end-user) auth ---
export const customerLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("ایمیل معتبر نیست"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export const customerRegisterSchema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید").max(80, "نام طولانی است"),
  email: z.string().trim().toLowerCase().email("ایمیل معتبر نیست"),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "شماره موبایل معتبر نیست")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").max(100),
});
