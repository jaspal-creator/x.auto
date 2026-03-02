import { z } from 'zod';

export const ibanValidator = (
  r1: string,
  // r2: string,
  // r3: string,
  // r4: string,
  // r5: string,
  c: string
) =>
  z
    .string()
    .min(5, r1)
    .max(24, r1)
    .refine((s) => !s.includes(' '), c);
// .length(24, r1)
// .regex(/^MD/, r2)
// .regex(/^\d{2}/, r3)
// .regex(/^[A-Za-z0-9]{2}/, r4)
// .regex(/^[A-Za-z0-9]{18}$/, r5)
