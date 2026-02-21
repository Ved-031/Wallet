import { api } from '@/core/api/axios';

export const getTransaction = async (id: number) => {
    const { data } = await api.get(`/transactions/${id}`);
    return data.data;
};
