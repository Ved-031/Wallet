import { prisma } from '../../config/prisma';

export const analyticsRepository = {
    async getMonthlyPersonalExpenses(userId: number, year: number) {
        return prisma.$queryRawUnsafe(
            `
      SELECT EXTRACT(MONTH FROM "createdAt") AS month,
             SUM(amount) AS amount
      FROM "Transaction"
      WHERE "userId" = $1
        AND type = 'EXPENSE'
        AND EXTRACT(YEAR FROM "createdAt") = $2
      GROUP BY month
      ORDER BY month
    `,
            userId,
            year,
        );
    },

    async getMonthlyGroupExpenses(userId: number, year: number) {
        return prisma.$queryRawUnsafe(
            `
      SELECT EXTRACT(MONTH FROM e."createdAt") AS month,
             SUM(ep.share) AS amount
      FROM "ExpenseParticipant" ep
      JOIN "Expense" e ON ep."expenseId" = e.id
      WHERE ep."userId" = $1
        AND EXTRACT(YEAR FROM e."createdAt") = $2
      GROUP BY month
      ORDER BY month
    `,
            userId,
            year,
        );
    },

    async getPersonalCategoryBreakdown(userId: number, month: number, year: number) {
        return prisma.$queryRawUnsafe(
            `
          SELECT category,
                 SUM(amount) AS amount
          FROM "Transaction"
          WHERE "userId" = $1
            AND type = 'EXPENSE'
            AND EXTRACT(MONTH FROM "createdAt") = $2
            AND EXTRACT(YEAR FROM "createdAt") = $3
          GROUP BY category
        `,
            userId,
            month,
            year,
        );
    },

    async getGroupCategoryBreakdown(userId: number, month: number, year: number) {
        return prisma.$queryRawUnsafe(
            `
          SELECT e.description AS category,
                 SUM(ep.share) AS amount
          FROM "ExpenseParticipant" ep
          JOIN "Expense" e ON ep."expenseId" = e.id
          WHERE ep."userId" = $1
            AND EXTRACT(MONTH FROM e."createdAt") = $2
            AND EXTRACT(YEAR FROM e."createdAt") = $3
          GROUP BY e.description
        `,
            userId,
            month,
            year,
        );
    },
};
