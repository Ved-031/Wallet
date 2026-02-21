export type TransactionType = "INCOME" | "EXPENSE";

export type Transaction = {
    id: number;
    userId: number;
    title: string;
    amount: number;
    type: TransactionType;
    category: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export type CreateTransactionDto = {
    title: string;
    amount: number;
    type: TransactionType;
    category?: string;
};
