import { z } from 'zod';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createWebsiteSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().regex(slugPattern, 'Slug must be lowercase kebab-case'),
  domain: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  enabledModules: z.array(z.string()).optional(),
  configuration: z.record(z.string(), z.unknown()).optional(),
});
