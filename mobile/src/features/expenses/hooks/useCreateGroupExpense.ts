import { createGroupExpense } from '../api/createGroupExpense';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateGroupExpense = (groupId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createGroupExpense,

        onMutate: async payload => {
            await queryClient.cancelQueries({ queryKey: ['group-expenses', groupId] });
            await queryClient.cancelQueries({ queryKey: ['group-balances', groupId] });
            await queryClient.cancelQueries({ queryKey: ['groups-preview'] });

            const previousExpenses = queryClient.getQueryData<any>(['group-expenses', groupId]);
            const previousBalances = queryClient.getQueryData<any>(['group-balances', groupId]);
            const previousPreview = queryClient.getQueryData<any>(['groups-preview']);

            // ---------- TEMP EXPENSE ----------
            const tempExpense = {
                id: `temp-${Date.now()}`,
                description: payload.description,
                amount: payload.amount.toString(),
                groupId,
                paidBy: payload.paidBy,
                createdAt: new Date().toISOString(),
                payer: { id: payload.paidBy, name: 'You', avatar: null },
                participants: payload.splits.map(s => ({
                    userId: s.userId,
                    share: s.amount.toString(),
                    paidShare: s.userId === payload.paidBy ? payload.amount.toString() : '0',
                    user: { id: s.userId, name: '', avatar: null },
                })),
            };

            // ---------- UPDATE EXPENSE HISTORY ----------
            if (previousExpenses?.data) {
                queryClient.setQueryData(['group-expenses', groupId], {
                    ...previousExpenses,
                    data: [tempExpense, ...previousExpenses.data],
                });
            }

            // ---------- UPDATE BALANCES ----------
            if (previousBalances) {
                const updated = previousBalances.map((u: any) => {
                    const split = payload.splits.find(s => s.userId === u.userId);
                    if (!split) return u;

                    const share = split.amount;

                    // payer gains money
                    if (u.userId === payload.paidBy) {
                        const othersTotal = payload.amount - share;
                        return { ...u, balance: Number((u.balance + othersTotal).toFixed(2)) };
                    }

                    // participants owe payer
                    return { ...u, balance: Number((u.balance - share).toFixed(2)) };
                });

                queryClient.setQueryData(['group-balances', groupId], updated);
            }

            // ---------- UPDATE GROUP PREVIEW ----------
            if (previousPreview) {
                queryClient.setQueryData(
                    ['groups-preview'],
                    previousPreview.map((g: any) => {
                        if (g.id !== groupId) return g;

                        const myShare =
                            payload.splits.find(s => s.userId === g.currentUserId)?.amount || 0;
                        const delta =
                            payload.paidBy === g.currentUserId
                                ? payload.amount - myShare
                                : -myShare;

                        return {
                            ...g,
                            balance: Number((g.balance + delta).toFixed(2)),
                        };
                    }),
                );
            }

            return { previousExpenses, previousBalances, previousPreview };
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.previousExpenses)
                queryClient.setQueryData(['group-expenses', groupId], ctx.previousExpenses);

            if (ctx?.previousBalances)
                queryClient.setQueryData(['group-balances', groupId], ctx.previousBalances);

            if (ctx?.previousPreview)
                queryClient.setQueryData(['groups-preview'], ctx.previousPreview);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['group-expenses', groupId] });
            queryClient.invalidateQueries({ queryKey: ['group-balances', groupId] });
            queryClient.invalidateQueries({ queryKey: ['groups-preview'] });
        },
    });
};
