import { api } from "@/core/api/axios"
import { useQuery } from "@tanstack/react-query";

export type DashboardSummary = {
    netBalance: number;
    youOwe: number;
    youAreOwed: number;
    personalBalance: number;
    activeGroups: number;
    totalExpensesThisMonth: number;
}

export const useDashboardSummary = () => {
    return useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: async () => {
            const { data } = await api.get(`/dashboard/summary`)
            return data.data as DashboardSummary;
        },
        staleTime: 1000 * 60 * 5,
    });
}
