import dayjs from '@/shared/utils/dayjs';
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { ActivityUI } from '@/features/activity/types';
import { formatCurrency } from "@/shared/utils/currency";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useActivitySheet } from '@/features/activity/context/ActivitySheetContext';

type Props = {
    item: ActivityUI;
    showDate?: boolean;
    onEdit?: (item: ActivityUI) => void;
    onDelete?: (item: ActivityUI) => void;
}

export const ActivityItem = ({ item, showDate = true, onEdit, onDelete }: Props) => {
    const { openSheet } = useActivitySheet();

    const icon =
        item.type === 'GROUP'
            ? 'people-outline'
            : item.type === 'SETTLEMENT'
                ? 'swap-horizontal-outline'
                : 'receipt-outline';

    return (
        <GestureHandlerRootView>
            <Pressable
                className="flex-row items-center py-3"
                onLongPress={() => openSheet(item, { onEdit, onDelete })}
                delayLongPress={250}
            >
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
            </Pressable>
        </GestureHandlerRootView>
    );
}
