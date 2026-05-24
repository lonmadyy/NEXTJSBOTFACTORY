import 'dotenv/config'
import type { Config } from 'drizzle-kit'

export default {
  schema: './bot/db/schema.ts',
  out: './bot/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config
