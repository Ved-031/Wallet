import { sendInvite } from '../api/sendInvite';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSendInvite = (groupId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (email: string) => sendInvite({ groupId, email }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-invites'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['group-invites', groupId] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });
};
