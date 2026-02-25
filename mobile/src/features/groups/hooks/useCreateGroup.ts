import { api } from '@/core/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            const { data } = await api.post('/groups', { name });
            return data.data;
        },
        onMutate: async name => {
            await queryClient.cancelQueries({ queryKey: ['groups-preview'] });
            await queryClient.cancelQueries({ queryKey: ['dashboard-groups'] });

            const previousGroupsPreview = queryClient.getQueryData<any[]>(['groups-preview']);
            const previousDashboardGroups = queryClient.getQueryData<any[]>(['dashboard-groups']);

            queryClient.setQueryData(['groups-preview'], (old: any[] = []) => [
                {
                    id: `temp-${Date.now()}`,
                    name,
                    balance: 0,
                    youOwe: 0,
                    youAreOwed: 0,
                    memberAvatars: [],
                    isSettled: true,
                    createdAt: new Date().toISOString(),
                },
                ...old,
            ]);

            if (previousDashboardGroups) {
                queryClient.setQueryData(['dashboard-groups'], (old: any[] = []) => [
                    ...old,
                    {
                        id: `temp-${Date.now()}`,
                        name,
                        balance: 0,
                        youOwe: 0,
                        youAreOwed: 0,
                        memberAvatars: [],
                        isSettled: true,
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }

            return { previousGroupsPreview, previousDashboardGroups };
        },
        onError: (_, __, context) => {
            if (context?.previousGroupsPreview) {
                queryClient.setQueryData(['groups-preview'], context.previousGroupsPreview);
            }
            if (context?.previousDashboardGroups) {
                queryClient.setQueryData(['dashboard-groups'], context.previousDashboardGroups);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['groups-preview'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-groups'] });
        },
    });
};
