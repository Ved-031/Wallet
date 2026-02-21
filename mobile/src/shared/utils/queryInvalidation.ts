import { QueryClient } from '@tanstack/react-query';

export const invalidateDashboard = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-groups'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-debts'] });
    queryClient.invalidateQueries({ queryKey: ['analytics-monthly'] });
};
