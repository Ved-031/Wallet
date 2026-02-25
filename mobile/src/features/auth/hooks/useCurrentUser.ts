import { User } from '../types';
import { api } from '@/core/api/axios';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const { data } = await api.get('/user/me');
            return data.data as User;
        },
        staleTime: 1000 * 60 * 5,
    });
};
