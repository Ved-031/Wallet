import { deleteGroup } from '../api/deleteGroup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteGroup = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteGroup,

        onSuccess: (_data, groupId) => {
            qc.invalidateQueries({ queryKey: ['groups-preview'] });
            qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
            qc.removeQueries({ queryKey: ['group-details', groupId] });
        },
    });
};
