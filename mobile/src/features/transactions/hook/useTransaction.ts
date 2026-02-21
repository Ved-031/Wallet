import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '../api/getTransaction';

export const useTransaction = (id: number) => {
    return useQuery({
        queryKey: ['transaction', id],
        queryFn: () => getTransaction(id),
        enabled: !!id && !isNaN(id),
    });
};
