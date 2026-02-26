import { COLORS } from "@/shared/constants/colors";
import { formatCurrency } from "@/shared/utils/currency";
import { View, Text, Image, Pressable } from "react-native";

type Props = {
    from: {
        name: string;
        avatar?: string | null;
    };
    to: {
        name: string;
        avatar?: string | null;
    };
    amount: number;
    onPress: () => void;
};

export const SettlementSuggestionRow = ({ from, to, amount, onPress }: Props) => {
    return (
        <Pressable
            onPress={onPress}
            className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex-row items-center justify-between mb-3"
        >
            {/* LEFT */}
            <View className="flex-row items-center gap-3">
                <Image
                    source={from.avatar ? { uri: from.avatar } : require("@assets/images/logo.png")}
                    className="w-10 h-10 rounded-full"
                />

                <View>
                    <Text className="text-text font-medium">
                        {from.name} → {to.name}
                    </Text>

                    <Text className="text-textLight text-sm">
                        Pay {formatCurrency(amount)}
                    </Text>
                </View>
            </View>

            {/* BUTTON */}
            <View className="bg-primary px-4 py-2 rounded-xl">
                <Text className="text-white font-semibold">Settle</Text>
            </View>
        </Pressable>
    );
};
