import { updatePushPreference } from '../api/updatePushPreference';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePushPreference = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (enabled: boolean) => updatePushPreference(enabled),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
};
