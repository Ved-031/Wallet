import { AppError } from '../../utils/AppError';
import { TransactionType } from '@prisma/client';
import { transactionRepository } from './transactions.repository';

type CreateTransactionDto = {
    title: string;
    amount: number;
    type: TransactionType;
    category?: string;
};

export const transactionService = {
    async create(userId: number, data: CreateTransactionDto) {
        return transactionRepository.create({
            userId,
            ...data,
        });
    },

    async getAll(userId: number) {
        return transactionRepository.findAllByUser(userId);
    },

    async update(userId: number, id: number, data: Partial<CreateTransactionDto>) {
        const existing = await transactionRepository.findById(id);

        if (!existing) {
            throw new AppError('Transaction not found', 404);
        }

        if (existing.userId !== userId) {
            throw new AppError('Not authorized to update this transaction', 403);
        }

        return transactionRepository.update(id, data);
    },

    async delete(userId: number, id: number) {
        const existing = await transactionRepository.findById(id);

        if (!existing) {
            throw new AppError('Transaction not found', 404);
        }

        if (existing.userId !== userId) {
            throw new AppError('Not authorized to delete this transaction', 403);
        }

        await transactionRepository.delete(id);
    },

    async getSummary(userId: number) {
        return transactionRepository.getSummary(userId);
    },
};
