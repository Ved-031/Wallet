import { api } from "@/core/api/axios";
import { Transaction, UpdateTransactionDto } from "../types";

export const updateTransaction = async (id: number, data: UpdateTransactionDto): Promise<Transaction> => {
    const res = await api.patch(`/transactions/${id}`, data);
    return res.data.data as Transaction;
}
