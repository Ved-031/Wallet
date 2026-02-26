import { cn } from "@/shared/utils/cn";
import { View, Text, Image } from "react-native";
import { formatCurrency } from "@/shared/utils/currency";

type Props = {
    name: string;
    avatar?: string | null;
    amount: number;
    isCurrentUser: boolean;
};

export const GroupBalanceRow = ({ name, avatar, amount, isCurrentUser }: Props) => {
    const isSettled = amount === 0;

    let subtitle = 'Settled up';
    let color = 'text-textLight';

    if (!isSettled) {
        if (isCurrentUser) {
            subtitle = amount > 0
                ? `You should receive ${formatCurrency(Math.abs(amount))}`
                : `You owe ${formatCurrency(Math.abs(amount))}`;
            color = amount > 0 ? 'text-green-600' : 'text-red-500';
        } else {
            subtitle = amount > 0
                ? `${name} owes you ${formatCurrency(Math.abs(amount))}`
                : `You owe ${name} ${formatCurrency(Math.abs(amount))}`;
            color = amount > 0 ? 'text-green-600' : 'text-red-500';
        }
    }

    return (
        <View className="flex-row items-center justify-between py-3">
            {/* LEFT */}
            <View className="flex-row items-center gap-3">
                <Image
                    source={avatar ? { uri: avatar } : require('@assets/images/logo.png')}
                    className="w-10 h-10 rounded-full"
                />
                <View>
                    <Text className="text-text font-medium">
                        {isCurrentUser ? 'You' : name}
                    </Text>
                    <Text className="text-textLight text-sm">
                        {subtitle}
                    </Text>
                </View>
            </View>

            {/* RIGHT AMOUNT */}
            {!isSettled && (
                <Text className={cn("font-semibold", color)}>
                    {formatCurrency(Math.abs(amount))}
                </Text>
            )}
        </View>
    );
};
