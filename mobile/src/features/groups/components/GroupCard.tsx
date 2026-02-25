import { cn } from "@/shared/utils/cn";
import { GroupPreview } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { formatCurrency } from "@/shared/utils/currency";
import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

type Props = {
    group: GroupPreview;
}

export const GroupCard = ({ group }: Props) => {
    const statusText = group.balance === 0
        ? 'All settled'
        : group.balance > 0
            ? 'You are owed'
            : 'You owe';

    const netAmount = Math.abs(group.balance);

    const amount = (group.youOwe ?? 0) > 0 ? group.youOwe : (group.youAreOwed ?? 0);

    const color = group.isSettled
        ? 'text-textLight'
        : (group.youOwe ?? 0) > 0
            ? 'text-red-500'
            : 'text-green-600';

    return (
        <Pressable
            onPress={() => router.push({
                pathname: '/groups/[id]',
                params: { id: group.id },
            })}
            className="bg-card rounded-2xl px-5 py-4 mb-4 border border-border flex-row items-center justify-between"
        >
            <View className="gap-2">
                <View className="flex-row items-center gap-3">
                    {/* MEMBER AVATARS */}
                    <View className="flex-row ml-2">
                        {group.memberAvatars.slice(0, 4).map((avatar, i) => (
                            <Image
                                key={i}
                                source={{ uri: avatar }}
                                className="h-8 w-8 rounded-full -ml-3 border-2 border-background"
                            />
                        ))}
                    </View>

                    {/* GROUP NAME */}
                    <Text className="text-text text-xl font-semibold">
                        {group.name}
                    </Text>
                </View>

                {/* STATUS TEXT */}
                <View className="flex-row items-center gap-1">
                    {group.isSettled
                        ? null
                        : group.balance > 0
                            ? <Ionicons
                                name="arrow-up-outline"
                                size={14}
                                color={COLORS.income}
                            />
                            : <Ionicons
                                name="arrow-down-outline"
                                size={14}
                                color={COLORS.expense}
                            />
                    }
                    <Text className="text-textLight text-sm">
                        {group.isSettled ? 'All settled 🎉' : `${statusText} ${formatCurrency(netAmount)}`}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <Text className={cn('font-semibold', color)}>
                    {group.isSettled ? 'Settled' : formatCurrency(amount)}
                </Text>
                <Ionicons
                    name="chevron-forward-outline"
                    size={15}
                    color={COLORS.text}
                />
            </View>
        </Pressable>
    );
}
