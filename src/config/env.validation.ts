import { z } from 'zod';

export const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().int().positive().default(3000),
  MORALIS_API_KEY: z.string(),
  CHAIN: z.string(),
});

export type EnvironmentVariables = z.infer<typeof environmentSchema>; 