import { prisma } from '../../config/prisma';
import { Prisma, TransactionType } from '@prisma/client';

type CreateTransactionInput = {
    userId: number;
    title: string;
    amount: Prisma.Decimal | number;
    type: TransactionType;
    category?: string | null;
};

export const transactionRepository = {
    async create(data: CreateTransactionInput) {
        return prisma.transaction.create({
            data: {
                userId: data.userId,
                title: data.title,
                amount: new Prisma.Decimal(data.amount),
                type: data.type,
                category: data.category,
            },
        });
    },

    async findAllByUser(userId: number) {
        return prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    },

    async findById(id: number) {
        return prisma.transaction.findUnique({
            where: { id },
        });
    },

    async update(id: number, data: Partial<CreateTransactionInput>) {
        return prisma.transaction.update({
            where: { id },
            data: {
                ...(data.title !== undefined && { title: data.title }),
                ...(data.amount !== undefined && { amount: new Prisma.Decimal(data.amount) }),
                ...(data.type !== undefined && { type: data.type }),
                ...(data.category !== undefined && { category: data.category }),
            },
        });
    },

    async delete(id: number) {
        return prisma.transaction.delete({
            where: { id },
        });
    },

    async getSummary(userId: number) {
        const result = await prisma.transaction.groupBy({
            by: ['type'],
            where: { userId },
            _sum: { amount: true },
        });

        let income = 0;
        let expense = 0;

        for (const row of result) {
            if (row.type === 'INCOME') {
                income = Number(row._sum.amount ?? 0);
            } else {
                expense = Number(row._sum.amount ?? 0);
            }
        }

        return {
            income,
            expense,
            balance: income - expense,
        };
    },

    async findPaginatedByUser(userId: number, cursor?: Date, limit: number = 20) {
        return prisma.transaction.findMany({
            where: {
                userId,
                ...(cursor && {
                    createdAt: {
                        lt: cursor,
                    },
                }),
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });
    },
};
