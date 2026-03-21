import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

// Use pooled connection if available, fallback to direct
const connectionString =
  process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("No database connection URL found. Set DATABASE_URL or DIRECT_URL in .env");
}

const pool =
  globalForPrisma.pool ??
  new Pool({ connectionString });

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.pool = pool;
}