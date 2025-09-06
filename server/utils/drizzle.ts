import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { EnhancedQueryLogger } from 'drizzle-query-logger'
import pino from 'pino'
import * as schema from '../database/schema'
import 'dotenv/config'

export { and, eq, or, sql } from 'drizzle-orm'

export const tables = schema

const connectionString = process.env.DATABASE_URL!

const pinoLogger = pino()

const logger = new EnhancedQueryLogger({
  log: (message) => {
    pinoLogger.info(message)
  },
})

const queryClient = postgres(connectionString, { prepare: false })

export function useDrizzle() {
  return drizzle(queryClient, { schema, logger })
}
