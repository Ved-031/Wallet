import { createSettlement } from '../api/createSettlement';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateSettlement = (groupId: number) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createSettlement,

        onSuccess: () => {
            // Group screen
            qc.invalidateQueries({ queryKey: ['group-balances', groupId] });
            qc.invalidateQueries({ queryKey: ['group-details', groupId] });
            qc.invalidateQueries({ queryKey: ['group-expenses', groupId] });
            qc.invalidateQueries({ queryKey: ['group-settlements', groupId] });

            // Dashboard
            qc.invalidateQueries({ queryKey: ['dashboard-groups'] });
            qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
            qc.invalidateQueries({ queryKey: ['groups-preview'] });

            // Activity
            qc.invalidateQueries({ queryKey: ['dashboard-activity'] });
        },
    });
};
