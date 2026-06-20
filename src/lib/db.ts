import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Optimization for serverless environments like Netlify
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    datasources: {
      db: {
        // Force timeout to avoid Netlify function hanging
        url: process.env.DATABASE_URL + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connect_timeout=3'
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
