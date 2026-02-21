import { api } from "@/core/api/axios";

export const deleteTransaction = async (id: number) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
}
