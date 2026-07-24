import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().regex(slugPattern, 'Slug must be lowercase kebab-case'),
  description: z.string().trim().optional(),
  price: z.number().positive(),
  currency: z.string().trim().min(1).default('USD'),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).optional(),
  slug: z.string().trim().regex(slugPattern, 'Slug must be lowercase kebab-case').optional(),
  description: z.string().trim().optional(),
  price: z.number().positive().optional(),
  currency: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional(),
});
