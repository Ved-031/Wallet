import { View, Text, Image } from 'react-native';
import { GroupExpenseUI } from '../mapGroupExpense';
import { formatCurrency } from '@/shared/utils/currency';

export const GroupExpenseItem = ({ item }: { item: GroupExpenseUI }) => {
    const color =
        item.direction === 'in'
            ? 'text-green-600'
            : item.direction === 'out'
                ? 'text-red-500'
                : 'text-textLight';

    const sign =
        item.direction === 'in'
            ? '+'
            : item.direction === 'out'
                ? '-'
                : '';

    return (
        <View className="flex-row items-center border-b-[0.5px] border-border py-2">
            <Image
                source={{ uri: item.avatar }}
                className="w-11 h-11 rounded-full"
            />

            <View className="flex-1 ml-3">
                <Text className="text-text font-medium">{item.title}</Text>
                <Text className="text-textLight text-sm mt-1">{item.subtitle}</Text>
            </View>

            <Text className={`${color} font-semibold`}>
                {sign} {formatCurrency(item.amount)}
            </Text>
        </View>
    );
};
