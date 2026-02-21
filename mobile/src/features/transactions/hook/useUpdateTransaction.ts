import { updateTransaction } from "../api/updateTransaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: any) => updateTransaction(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['dashboard-activity'] });

            const previous = queryClient.getQueryData<any>(['dashboard-activity']);

            queryClient.setQueryData(['dashboard-activity'], (old: any) => ({
                ...old,
                pages: old.pages.map((page: any) => ({
                    ...page,
                    data: page.data.map((item: any) => (item.id === id ? { ...item, ...data } : item)),
                })),
            }));

            return { previous };
        },

        onError: (_id, _vars, ctx: any) => {
            if (ctx.previous) queryClient.setQueryData(['dashboard-activity'], ctx.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['monthly-spending'] });
            queryClient.invalidateQueries({ queryKey: ['category-breakdown'] });
            queryClient.invalidateQueries({ queryKey: ['activity-preview'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
        }
    });
}
