import { api } from '@/core/api/axios';

export const createSettlement = async ({
    groupId,
    paidTo,
    amount,
    note,
}: {
    groupId: number;
    paidTo: number;
    amount: number;
    note?: string;
}) => {
    const { data } = await api.post('/settlements', {
        groupId,
        paidTo,
        amount,
        note,
    });

    return data.data;
};
