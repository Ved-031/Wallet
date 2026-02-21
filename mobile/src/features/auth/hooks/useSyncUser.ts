import { api } from '@/core/api/axios';
import { useMutation } from '@tanstack/react-query';

export const useSyncUser = () => {
    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post('/user/callback');
            return data;
        },
    });
};
