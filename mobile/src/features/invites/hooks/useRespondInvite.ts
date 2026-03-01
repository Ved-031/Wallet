import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptInvite, declineInvite } from '../api/respondInvite';

export const useRespondInvite = () => {
    const qc = useQueryClient();

    const optimisticRemove = async (inviteId: number) => {
        await qc.cancelQueries({ queryKey: ['invites'] });

        const previous = qc.getQueryData<any[]>(['invites']);

        qc.setQueryData(['invites'], (old: any[] = []) => old.filter(i => i.id !== inviteId));

        return { previous };
    };

    const rollback = (context: any) => {
        if (context?.previous) {
            qc.setQueryData(['invites'], context.previous);
        }
    };

    const onSettled = () => {
        qc.invalidateQueries({ queryKey: ['groups-preview'] });
        qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
        qc.invalidateQueries({ queryKey: ['invites'] });
        qc.invalidateQueries({ queryKey: ['notifications'] });
    };

    const accept = useMutation({
        mutationFn: acceptInvite,
        onMutate: optimisticRemove,
        onError: (_err, _vars, ctx) => rollback(ctx),
        onSettled,
    });

    const decline = useMutation({
        mutationFn: declineInvite,
        onMutate: optimisticRemove,
        onError: (_err, _vars, ctx) => rollback(ctx),
        onSettled,
    });

    return { accept, decline };
};
