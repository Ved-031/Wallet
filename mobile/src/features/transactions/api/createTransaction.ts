import { api } from "@/core/api/axios";
import { CreateTransactionDto, Transaction } from "../types";

export const createTransaction = async (data: CreateTransactionDto): Promise<Transaction> => {
    const res = await api.post('/transactions', data);
    return res.data.data;
}
