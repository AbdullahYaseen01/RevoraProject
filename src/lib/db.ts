import { neon } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Neon serverless connection for direct SQL queries if needed
export const sql = neon(process.env.DATABASE_URL!);
