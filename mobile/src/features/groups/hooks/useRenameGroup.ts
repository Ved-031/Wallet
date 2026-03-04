import { renameGroup } from '../api/renameGroup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useRenameGroup = (groupId: number) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (name: string) => renameGroup({ groupId, name }),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['groups-preview'] });
            qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
            qc.invalidateQueries({ queryKey: ['group-details', groupId] });
        },
    });
};
