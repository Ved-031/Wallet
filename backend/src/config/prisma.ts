import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

declare global {
    var __prisma__: PrismaClient | undefined;
}

const prisma = global.__prisma__ || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
    global.__prisma__ = prisma;
}

export default prisma;
export { prisma };
