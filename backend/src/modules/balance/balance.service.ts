import { AppError } from '../../utils/AppError';
import { balanceRepository } from './balance.repository';

export const balanceService = {
    async getGroupBalances(currentUserId: number, groupId: number) {
        // 1️⃣ verify membership
        const members = await balanceRepository.getGroupMembers(groupId);

        const memberIds = new Set(members.map(m => m.userId));

        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        // initialize balances
        const balances: Record<number, number> = {};
        members.forEach(m => (balances[m.userId] = 0));

        // 2️⃣ apply expenses
        const participants = await balanceRepository.getExpenseParticipants(groupId);
        const expenseMap: Record<number, typeof participants> = {};

        for (const p of participants) {
            const expId = p.expense.id;
            if (!expenseMap[expId]) expenseMap[expId] = [];
            expenseMap[expId].push(p);
        }

        for (const expParts of Object.values(expenseMap)) {
            const payerId = expParts[0].expense.paidBy;

            for (const part of expParts) {
                if (part.userId === payerId) continue;

                const share = Number(part.share);

                balances[part.userId] -= share;
                balances[payerId] += share;
            }
        }

        // 3️⃣ apply settlements
        const settlements = await balanceRepository.getSettlements(groupId);

        for (const s of settlements) {
            const amount = Number(s.amount);

            balances[s.paidBy] += amount;
            balances[s.paidTo] -= amount;
        }

        // 4️⃣ format response
        return members.map(m => ({
            userId: m.user.id,
            name: m.user.name,
            email: m.user.email,
            avatar: m.user.avatar,
            balance: Number(balances[m.userId].toFixed(2)),
        }));
    },

    async getSimplifiedSettlements(currentUserId: number, groupId: number) {
        const balances = await this.getGroupBalances(currentUserId, groupId);

        const creditors = [];
        const debtors = [];

        for (const u of balances) {
            if (u.balance > 0) creditors.push({ ...u });
            if (u.balance < 0) debtors.push({ ...u });
        }

        // largest first
        creditors.sort((a, b) => b.balance - a.balance);
        debtors.sort((a, b) => a.balance - b.balance);

        const settlements: any[] = [];

        let i = 0,
            j = 0;

        while (i < debtors.length && j < creditors.length) {
            const debtor = debtors[i];
            const creditor = creditors[j];

            const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

            settlements.push({
                from: {
                    userId: debtor.userId,
                    name: debtor.name,
                    avatar: debtor.avatar,
                },
                to: {
                    userId: creditor.userId,
                    name: creditor.name,
                    avatar: creditor.avatar,
                },
                amount: Number(amount.toFixed(2)),
            });

            debtor.balance += amount;
            creditor.balance -= amount;

            if (Math.abs(debtor.balance) < 0.01) i++;
            if (creditor.balance < 0.01) j++;
        }

        return settlements;
    },
};
