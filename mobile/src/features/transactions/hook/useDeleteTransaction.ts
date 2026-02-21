import { deleteTransaction } from '../api/deleteTransaction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTransaction(id),

        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['dashboard-summary'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard-activity'] });
            await queryClient.cancelQueries({ queryKey: ['activity-preview'] });

            const previousPreview = queryClient.getQueryData<any>(['activity-preview']);
            const previousActivity = queryClient.getQueryData<any>(['dashboard-activity']);

            // Remove from dashboard preview
            if (previousPreview) {
                queryClient.setQueryData(['activity-preview'], {
                    ...previousPreview,
                    data: previousPreview.data.filter((item: any) => item.id !== `txn_${id}`),
                });
            }

            // Remove from infinite list
            if (previousActivity) {
                queryClient.setQueryData(['dashboard-activity'], (old: any) => ({
                    ...old,
                    pages: old.pages.map((page: any) => ({
                        ...page,
                        data: page.data.filter((item: any) => item.id !== `txn_${id}`),
                    })),
                }));
            }

            return { previousPreview, previousActivity };
        },

        onError: (_err, _id, ctx: any) => {
            if (ctx?.previousActivity)
                queryClient.setQueryData(['dashboard-activity'], ctx.previousActivity);
            if (ctx?.previousPreview)
                queryClient.setQueryData(['activity-preview'], ctx.previousPreview);
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
