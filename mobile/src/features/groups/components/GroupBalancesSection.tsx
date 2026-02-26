import { COLORS } from "@/shared/constants/colors";
import { GroupBalanceRow } from "./GroupBalanceRow";
import { View, Text, ActivityIndicator } from "react-native";
import { useGroupBalances } from "../hooks/useGroupBalances";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export const GroupBalancesSection = ({ groupId }: { groupId: number }) => {
    const { data, isLoading } = useGroupBalances(groupId);
    const { data: me } = useCurrentUser();

    if (isLoading) {
        return (
            <View className="py-10 items-center">
                <ActivityIndicator size={'small'} color={COLORS.primary} />
            </View>
        );
    }

    if (!data?.length || !me) return null;

    const myBalance = data.find(u => u.userId === me.id)?.balance ?? 0;

    const mapped = data.map(user => {
        const relative = user.balance - myBalance;
        return {
            ...user,
            relativeAmount: relative,
            isCurrentUser: user.userId === me.id
        }
    });

    return (
        <View>
            <Text className="text-text text-xl font-semibold mb-4">
                Balances
            </Text>

            {mapped.map(user => (
                <GroupBalanceRow
                    key={user.userId}
                    name={user.name}
                    avatar={user.avatar}
                    amount={user.relativeAmount}
                    isCurrentUser={user.isCurrentUser}
                />
            ))}
        </View>
    );
};
