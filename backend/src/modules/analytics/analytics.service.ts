import { analyticsRepository } from './analytics.repository';

export const analyticsService = {
    async getMonthlySpending(userId: number, year: number) {
        const [personal, group] = await Promise.all([
            analyticsRepository.getMonthlyPersonalExpenses(userId, year),
            analyticsRepository.getMonthlyGroupExpenses(userId, year),
        ]);

        const map: Record<number, number> = {};

        for (const row of personal as any)
            map[row.month] = (map[row.month] || 0) + Number(row.amount);

        for (const row of group as any) map[row.month] = (map[row.month] || 0) + Number(row.amount);

        // ensure all 12 months exist
        const result = [];
        for (let m = 1; m <= 12; m++) {
            result.push({ month: m, amount: map[m] || 0 });
        }

        return result;
    },

    async getCategoryBreakdown(userId: number, month: number, year: number) {
        const [personal, group] = await Promise.all([
            analyticsRepository.getPersonalCategoryBreakdown(userId, month, year),
            analyticsRepository.getGroupCategoryBreakdown(userId, month, year),
        ]);

        const map: Record<string, number> = {};

        for (const row of personal as any) {
            const key = row.category || 'Uncategorized';
            map[key] = (map[key] || 0) + Number(row.amount);
        }

        for (const row of group as any) {
            const key = row.category || 'Group Expense';
            map[key] = (map[key] || 0) + Number(row.amount);
        }

        return Object.entries(map).map(([category, amount]) => ({
            category,
            amount,
        }));
    },
};
