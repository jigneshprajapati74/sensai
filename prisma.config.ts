import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.DIRECT_URL,
      directUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});