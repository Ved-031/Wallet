import { View, Text, ActivityIndicator } from "react-native";
import { useGroupSettlementSuggestions } from "../hooks/useGroupSettlementSuggestions";
import { SettlementSuggestionRow } from "./SettlementSuggestionRow";

export const SettlementSuggestionsSection = ({ groupId }: { groupId: number }) => {
    const { data, isLoading } = useGroupSettlementSuggestions(groupId);

    if (isLoading) {
        return (
            <View className="py-6 items-center">
                <ActivityIndicator />
            </View>
        );
    }

    if (!data || data.length === 0) return null;

    return (
        <View>
            <Text className="text-text text-xl font-semibold mb-4">
                Suggested settlements
            </Text>

            {data.map((s, i) => (
                <SettlementSuggestionRow
                    key={i}
                    from={s.from}
                    to={s.to}
                    amount={s.amount}
                    onPress={() => {
                        // Next step: open settlement modal
                        console.log("Settle", s);
                    }}
                />
            ))}
        </View>
    );
};
