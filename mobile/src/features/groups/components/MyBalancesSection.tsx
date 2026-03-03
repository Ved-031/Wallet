import { BalanceRow } from './BalanceRow';
import { COLORS } from '@/shared/constants/colors';
import { View, Text, ActivityIndicator } from 'react-native';
import { useGroupBalances } from '../hooks/useGroupBalances';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useGroupSettlements } from '../hooks/useGroupSettlements';

export const MyBalancesSection = ({ groupId }: { groupId: number }) => {
    const { data: settlements, isLoading } = useGroupSettlements(groupId);
    const { data: me } = useCurrentUser();

    if (isLoading) {
        return (
            <View className='flex items-center justify-center'>
                <ActivityIndicator size={'small'} color={COLORS.primary} />
            </View>
        )
    }

    if (!settlements || !me) return null;

    const mySettlements = settlements.filter(
        (s: any) => s.from.userId === me.id || s.to.userId === me.id
    );

    if (mySettlements.length === 0) return null;

    return (
        <View className="px-0 py-4 gap-3">
            {mySettlements.map((s: any, i: number) => (
                <BalanceRow
                    key={i}
                    me={me}
                    settlement={s}
                    groupId={groupId}
                />
            ))}
        </View>
    );
};
