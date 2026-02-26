import { SplitType } from '../types';
import { View, Text } from 'react-native';
import { SplitMemberRow } from './SplitMemberRow';
import { isEqualArray } from '@/shared/utils/isEqualArray';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
    members: { id: number; name: string; avatar?: string | null }[];
    amount: number;
    paidBy: number;
    splitType: SplitType;
    onChange: (splits: { userId: number; amount: number }[]) => void;
};

export const SplitEditor = ({
    members,
    amount,
    paidBy,
    splitType,
    onChange,
}: Props) => {
    const [values, setValues] = useState<Record<number, number>>({});
    const lastSentRef = useRef<{ userId: number; amount: number }[]>([]);

    /**
     * AUTO EQUAL SPLIT
     * Only modifies values — never calls onChange
     */
    useEffect(() => {
        if (splitType !== 'EQUAL' || !amount || members.length === 0) return;

        const share = Number((amount / members.length).toFixed(2));

        const next: Record<number, number> = {};
        members.forEach(m => (next[m.id] = share));

        // rounding fix
        const total = Object.values(next).reduce((a, b) => a + b, 0);
        const diff = Number((amount - total).toFixed(2));
        next[members[0].id] += diff;

        setValues(next);
    }, [amount, splitType, members.length]);

    // FINAL SPLITS (single source of truth)
    const splits = useMemo(() => {
        if (!amount) return [];

        if (splitType === 'PERCENT') {
            return members.map(m => ({
                userId: m.id,
                amount: Number(((values[m.id] || 0) / 100 * amount).toFixed(2)),
            }));
        }

        return members.map(m => ({
            userId: m.id,
            amount: Number((values[m.id] || 0).toFixed(2)),
        }));
    }, [values, splitType, amount, members]);

    // SEND TO PARENT (ONLY HERE)
    useEffect(() => {
        if (!splits.length) return;

        if (!isEqualArray(splits, lastSentRef.current)) {
            lastSentRef.current = splits;
            onChange(splits);
        }
    }, [splits]);

    // Remaining indicator
    const total = useMemo(
        () => splits.reduce((s, x) => s + x.amount, 0),
        [splits]
    );

    const remaining = Number((amount - total).toFixed(2));

    return (
        <View className="mt-4">
            {members.map(m => (
                <SplitMemberRow
                    key={m.id}
                    name={m.name}
                    avatar={m.avatar}
                    value={values[m.id] || 0}
                    unit={splitType === 'PERCENT' ? '%' : '₹'}
                    editable={splitType !== 'EQUAL'}
                    isPayer={paidBy === m.id}
                    onChange={(v) =>
                        setValues(prev => ({ ...prev, [m.id]: v }))
                    }
                />
            ))}

            <View className="pt-3 border-t border-border mt-3">
                <Text className="text-textLight text-sm">
                    Remaining: ₹{remaining.toFixed(2)}
                </Text>
            </View>
        </View>
    );
};
