import dayjs from '@/shared/utils/dayjs';
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ActivityUI } from '@/features/activity/types';
import { formatCurrency } from "@/shared/utils/currency";

type Props = {
    item: ActivityUI;
    showDate?: boolean;
}

export const ActivityItem = ({ item, showDate = true }: Props) => {
    const icon =
        item.type === 'GROUP'
            ? 'people-outline'
            : item.type === 'SETTLEMENT'
                ? 'swap-horizontal-outline'
                : 'receipt-outline';

    return (
        <View className="flex-row items-center py-3">
            {showDate && (
                <View className="items-center mr-2">
                    <Text className="text-text text-[12px] font-semibold">
                        {dayjs(item.createdAt).format('DD')}
                    </Text>
                    <Text className="text-textLight text-[10px]">
                        {dayjs(item.createdAt).format('MMM')}
                    </Text>
                </View>
            )}
            <View className="w-11 h-11 rounded-full bg-border/40 items-center justify-center">
                <Ionicons
                    name={icon}
                    size={20}
                    color="#4A3428"
                />
            </View>
            <View className="flex-1 ml-3">
                <Text className="text-text font-medium">{item.title}</Text>
                <Text className="text-textLight text-sm mt-1">{dayjs(item.createdAt).fromNow()}</Text>
            </View>
            {item.amount !== undefined && (
                <View className="items-end">
                    <Text className="text-text font-semibold">
                        {item.direction === 'out' ? '-' : '+'} {formatCurrency(item.amount)}
                    </Text>
                </View>
            )}
        </View>
    );
}
