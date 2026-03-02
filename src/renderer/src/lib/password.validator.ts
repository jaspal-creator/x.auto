import { z } from 'zod';

export const passwordValidator = (r1: string, r2: string, r3: string, c: string) =>
  z
    .string()
    .min(4, { message: r1 })
    .max(20)
    .trim()
    .refine((s) => !s.includes(' '), c)
    .refine((password) => /[a-zA-Z]/.test(password), {
      message: r2
    })
    .refine((password) => /\d/.test(password), {
      message: r3
    });
