import { balanceRepository } from './balance.repository';
import { AppError } from '../../utils/AppError';

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

        for (const p of participants) {
            const paid = Number(p.paidShare);
            const owed = Number(p.share);

            balances[p.userId] += paid - owed;
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
};
