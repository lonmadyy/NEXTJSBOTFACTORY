import 'server-only'
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type Schema = typeof schema
type DrizzleDb = PostgresJsDatabase<Schema>

let cached: DrizzleDb | null = null

function buildDb(): DrizzleDb {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. See SETUP.md for Neon configuration.')
  }

  // `prepare: false` — Neon pooled connection (pgbouncer transaction mode) не
  // поддерживает prepared statements. Обязательно для serverless на Vercel.
  // `max: 1` — одно соединение на инстанс функции, дружит со serverless.
  const queryClient = postgres(connectionString, { prepare: false, max: 1 })
  return drizzle(queryClient, { schema })
}

// Lazy proxy — реальная инициализация откладывается до первого обращения.
// Это нужно чтобы импорт модуля не падал во время Next build, когда DATABASE_URL
// ещё не подгружен (например, при сборке статических страниц).
export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_, prop, receiver) {
    if (!cached) cached = buildDb()
    return Reflect.get(cached, prop, receiver)
  },
}) as DrizzleDb

export type Db = typeof db
