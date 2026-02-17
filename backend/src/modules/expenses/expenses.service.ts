import { AppError } from '../../utils/AppError';
import { expensesRepository } from './expenses.repository';

type SplitInput = {
    userId: number;
    amount: number;
};

export const expensesService = {
    async createExpense(
        currentUserId: number,
        groupId: number,
        description: string,
        amount: number,
        paidBy: number,
        splits: SplitInput[],
    ) {
        if (!description || description.trim().length < 2)
            throw new AppError('Invalid description', 400);

        if (amount <= 0) throw new AppError('Amount must be greater than 0', 400);

        if (!splits || splits.length === 0) throw new AppError('Splits required', 400);

        // 1️⃣ get group members
        const members = await expensesRepository.getGroupMembers(groupId);
        const memberIds = new Set(members.map(m => m.userId));

        // creator must be member
        if (!memberIds.has(currentUserId))
            throw new AppError('You are not part of this group', 403);

        // payer must be member
        if (!memberIds.has(paidBy)) throw new AppError('Payer not in group', 400);

        // 2️⃣ validate split users
        for (const s of splits) {
            if (!memberIds.has(s.userId)) throw new AppError(`User ${s.userId} not in group`, 400);
        }

        // 3️⃣ validate total
        const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);

        if (Number(totalSplit.toFixed(2)) !== Number(amount.toFixed(2)))
            throw new AppError('Split amounts must equal total expense', 400);

        // 4️⃣ prepare participants
        const participants = splits.map(s => ({
            userId: s.userId,
            share: s.amount,
            paidShare: s.userId === paidBy ? amount : 0,
        }));

        // 5️⃣ save
        return expensesRepository.createExpense(
            groupId,
            paidBy,
            description.trim(),
            amount,
            participants,
        );
    },
};
