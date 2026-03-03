import { View, Text, Image } from 'react-native';
import { formatCurrency } from '@/shared/utils/currency';
import { cn } from '@/shared/utils/cn';

type Props = {
    item: {
        id: number;
        paidBy: number;
        paidTo: number;
        amount: number;
        payer: {
            id: number;
            name: string;
            avatar: string;
        };
        receiver: {
            id: number;
            name: string;
            avatar: string;
        };
        createdAt: string;
    };
    currentUserId: number;
};

export const GroupSettlementItem = ({
    item,
    currentUserId,
}: Props) => {
    const isPayer = item.paidBy === currentUserId;

    const otherUser = isPayer
        ? item.receiver
        : item.payer;

    return (
        <View className="flex-row items-center border-b-[0.5px] border-border py-2">
            {/* Avatar */}
            <Image
                source={{ uri: otherUser.avatar }}
                className="w-11 h-11 rounded-full"
            />

            {/* Text Content */}
            <View className="flex-1 ml-3">
                <Text className="text-text font-medium">
                    {isPayer
                        ? `You paid ${otherUser.name}`
                        : `${otherUser.name} paid you`}
                </Text>

                <Text className="text-textLight text-sm mt-1">
                    Settlement
                </Text>
            </View>

            {/* Amount */}
            <Text
                className={cn(
                    "font-semibold",
                    isPayer ? "text-red-600" : "text-green-600"
                )}
            >
                {formatCurrency(item.amount)}
            </Text>
        </View>
    );
};
