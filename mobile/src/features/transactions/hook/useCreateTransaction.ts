import { CreateTransactionDto } from '../types';
import { createTransaction } from '../api/createTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateTransactionDto) => await createTransaction(data),

        onMutate: async newTransaction => {
            await queryClient.cancelQueries({ queryKey: ['dashboard-summary'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard-activity'] });
            await queryClient.cancelQueries({ queryKey: ['activity-preview'] });

            const previousSummary = queryClient.getQueryData<any>(['dashboard-summary']);
            const previousActivity = queryClient.getQueryData<any>(['dashboard-activity']);
            const recentActivity = queryClient.getQueryData<any>(['activity-preview']);

            const optimisticActivity = {
                id: `temp-${Date.now()}`,
                type: 'PERSONAL',
                title:
                    newTransaction.type === 'EXPENSE'
                        ? `You spent on ${newTransaction.title}`
                        : `You received ${newTransaction.title}`,
                amount: newTransaction.amount,
                direction: newTransaction.type === 'EXPENSE' ? 'out' : 'in',
                createdAt: new Date().toISOString(),
            };

            // Preview list
            if (recentActivity) {
                queryClient.setQueryData(['activity-preview'], {
                    ...recentActivity,
                    data: [optimisticActivity, ...recentActivity.data],
                });
            }

            // Balance update
            if (previousSummary) {
                const delta =
                    newTransaction.type === 'EXPENSE'
                        ? -newTransaction.amount
                        : newTransaction.amount;

                queryClient.setQueryData(['dashboard-summary'], {
                    ...previousSummary,
                    netBalance: previousSummary.netBalance + delta,
                });
            }

            // Infinite activity list
            if (previousActivity) {
                queryClient.setQueryData(['dashboard-activity'], (old: any) => {
                    if (!old?.pages?.length) return old;

                    return {
                        ...old,
                        pages: [
                            {
                                ...old.pages[0],
                                data: [optimisticActivity, ...old.pages[0].data],
                            },
                            ...old.pages.slice(1),
                        ],
                    };
                });
            }

            return { previousSummary, previousActivity };
        },

        onError: (_err, _newExpense, context) => {
            if (context?.previousSummary) {
                queryClient.setQueryData(['dashboard-summary'], context.previousSummary);
            }
            if (context?.previousActivity) {
                queryClient.setQueryData(['dashboard-activity'], context.previousActivity);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['monthly-spending'] });
            queryClient.invalidateQueries({ queryKey: ['category-breakdown'] });
            queryClient.invalidateQueries({ queryKey: ['activity-preview'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
        },
    });
};
