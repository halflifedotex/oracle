import { z } from 'zod';

export const environmentSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  MORALIS_API_KEY: z.string(),
  CHAIN: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type EnvironmentVariables = z.infer<typeof environmentSchema>; 