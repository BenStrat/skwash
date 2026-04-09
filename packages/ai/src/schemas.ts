import { z } from 'zod';

export const clusterSchema = z.object({
  title: z.string(),
  summary: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  annotation_ids: z.array(z.string().uuid())
});
