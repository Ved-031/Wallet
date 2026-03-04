import { Notification } from '@/features/notifications/types';
import { acceptInvite, declineInvite } from '../api/respondInvite';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRespondInvite = () => {
    const qc = useQueryClient();

    const optimisticRemoveNotification = async (inviteId: number) => {
        await qc.cancelQueries({ queryKey: ['notifications'] });

        const previous = qc.getQueryData<Notification[]>(['notifications']);

        qc.setQueryData<Notification[]>(
            ['notifications'],
            old => old?.filter(n => n.meta?.inviteId !== inviteId) || [],
        );

        return { previous };
    };

    const rollback = (context: any) => {
        if (context?.previous) {
            qc.setQueryData(['notifications'], context.previous);
        }
    };

    const onSettled = () => {
        qc.invalidateQueries({ queryKey: ['notifications'] });
        qc.invalidateQueries({ queryKey: ['groups-preview'] });
        qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
        qc.invalidateQueries({ queryKey: ['group-invites'] });
        qc.invalidateQueries({ queryKey: ['invites'] });
    };

    const accept = useMutation({
        mutationFn: acceptInvite,
        onMutate: optimisticRemoveNotification,
        onError: (_err, _vars, ctx) => rollback(ctx),
        onSettled,
    });

    const decline = useMutation({
        mutationFn: declineInvite,
        onMutate: optimisticRemoveNotification,
        onError: (_err, _vars, ctx) => rollback(ctx),
        onSettled,
    });

    return { accept, decline };
};
