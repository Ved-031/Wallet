import { cn } from '@/shared/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/shared/utils/currency';
import { View, Text, Pressable, Image } from 'react-native';

export const BalanceRow = ({ user }: any) => {
    const iOwe = user.balance < 0;
    const amount = Math.abs(user.balance);

    return (
        <View
            className={cn(
                "flex-row items-center justify-between px-4 py-4 rounded-2xl border",
                iOwe ? "bg-red-100/40 border-red-100" : "bg-green-100/40 border-green-100"
            )}
        >
            {/* LEFT SIDE */}
            <View className="flex-row items-center gap-3">
                <Image
                    source={{ uri: user.avatar }}
                    className="w-10 h-10 rounded-full"
                />

                <View>
                    <Text className="text-text font-medium">
                        {iOwe
                            ? `You owe ${user.name}`
                            : `${user.name} owes you`}
                    </Text>

                    <Text
                        className={cn(
                            "text-sm mt-1 font-semibold",
                            iOwe ? "text-red-600" : "text-green-600"
                        )}
                    >
                        {formatCurrency(amount)}
                    </Text>
                </View>
            </View>

            {/* RIGHT SIDE */}
            <Pressable className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1">
                <Ionicons
                    name={iOwe ? "arrow-up-outline" : "arrow-down-outline"}
                    size={16}
                    color="white"
                />
                <Text className="text-white font-medium">
                    Settle
                </Text>
            </Pressable>
        </View>
    );
};
