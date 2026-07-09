import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required to start the API server."),
});

/**
 * Parse and validate environment variables.
 * Called only from the server/db entrypoints so that unit tests using an
 * in-memory repository never require a DATABASE_URL.
 */
export function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${message}`);
  }
  return parsed.data;
}

export type AppEnv = ReturnType<typeof loadEnv>;
