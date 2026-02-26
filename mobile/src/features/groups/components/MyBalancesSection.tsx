import { View, Text } from 'react-native';
import { BalanceRow } from './BalanceRow';
import { useGroupBalances } from '../hooks/useGroupBalances';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';

export const MyBalancesSection = ({ groupId }: { groupId: number }) => {
    const { data } = useGroupBalances(groupId);
    const { data: me } = useCurrentUser();

    if (!data || !me) return null;

    const relations = data.filter(u => u.userId !== me.id && u.balance !== 0);

    if (relations.length === 0) {
        return (
            <View className="px-5 py-4">
                <Text className="text-textLight text-center">
                    All settled 🎉
                </Text>
            </View>
        );
    }

    return (
        <View className="px-0 py-4 gap-3">
            {relations.map(u => (
                <BalanceRow key={u.userId} me={me.id} user={u} />
            ))}
        </View>
    );
};
