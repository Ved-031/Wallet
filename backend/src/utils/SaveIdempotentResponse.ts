import { prisma } from '../config/prisma';

export async function saveIdempotentResponse(key: string, userId: number, response: any) {
    await prisma.idempotencyKey.create({
        data: {
            key,
            userId,
            response,
        },
    });
}
