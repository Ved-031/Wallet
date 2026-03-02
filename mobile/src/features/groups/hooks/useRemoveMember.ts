import { removeMember } from '../api/removeMember';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRemoveMember = (groupId: number) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: removeMember,

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['group-details', groupId] });
            qc.invalidateQueries({ queryKey: ['group-balances', groupId] });
            qc.invalidateQueries({ queryKey: ['groups-preview'] });
            qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
        },
    });
};
