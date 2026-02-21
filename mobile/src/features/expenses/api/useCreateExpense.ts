import { api } from '@/core/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateDashboard } from '@/shared/utils/queryInvalidation';

type CreateExpenseInput = {
    groupId: number;
    description: string;
    amount: number;
    paidBy: number;
    splits: { userId: number; amount: number }[];
};

export const useCreateExpense = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateExpenseInput) => {
            const { data } = await api.post('/expenses', payload);
            return data.data;
        },

        // OPTIMISTIC UPDATE
        onMutate: async newExpense => {
            await queryClient.cancelQueries({ queryKey: ['dashboard-summary'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard-activity'] });

            const previousSummary = queryClient.getQueryData<any>(['dashboard-summary']);
            const previousActivity = queryClient.getQueryData<any>(['dashboard-activity']);

            if (previousSummary) {
                queryClient.setQueryData(['dashboard-summary'], {
                    ...previousSummary,
                    netBalance: previousSummary.netBalance - newExpense.amount,
                });
            }

            if (previousActivity) {
                queryClient.setQueryData(['dashboard-activity'], (old: any) => {
                    return {
                        ...old,
                        pages: [
                            {
                                ...old.pages[0],
                                data: [
                                    {
                                        id: 'temp-id',
                                        type: 'expense',
                                        description: newExpense.description,
                                        amount: newExpense.amount,
                                        createdAt: new Date().toISOString(),
                                    },
                                    ...old.pages[0].data,
                                ],
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
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
            // invalidateDashboard(queryClient);
        },
    });
};
