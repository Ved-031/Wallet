import { leaveGroup } from '../api/leaveGroup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLeaveGroup = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: leaveGroup,

        onSuccess: (_data, groupId) => {
            qc.invalidateQueries({ queryKey: ['groups-preview'] });
            qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
            qc.removeQueries({ queryKey: ['group-details', groupId] });
        },
    });
};
