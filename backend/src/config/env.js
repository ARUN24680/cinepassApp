import dotenv from 'dotenv';
import { z } from 'zod';

// 1. Load the variables from the .env file into process.env
dotenv.config();

// 2. Define the schema (the "rules") for our environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(3000), // Coerce converts string '3000' to number 3000
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_SSL: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  ).default(false),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long'),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

// 3. Validate process.env against our schema
const parsed = envSchema.safeParse(process.env);

// 4. If validation fails, log the exact errors and stop the app immediately
if (!parsed.success) {
  console.error('❌ Environment validation failed. Please check your .env file:');
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

// 5. Export the clean, typed configuration object
export const env = parsed.data;
export default env;
