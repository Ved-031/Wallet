import { api } from '@/core/api/axios';
import { useQuery } from '@tanstack/react-query';

export const useMonthlySpending = (year: number) => {
    return useQuery({
        queryKey: ['monthly-spending', year],
        queryFn: async () => {
            const { data } = await api.get('/analytics/monthly', {
                params: { year },
            });
            return data.data;
        },
    });
};

export const useCategoryBreakdown = (month: number, year: number) => {
    return useQuery({
        queryKey: ['category-breakdown', month, year],
        queryFn: async () => {
            const { data } = await api.get('/analytics/category', {
                params: { month, year }
            });
            return data.data;
        },
    });
};
