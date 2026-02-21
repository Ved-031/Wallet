import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";

export default function HelpSupportScreen() {
    const router = useRouter();

    return (
        <ScrollView
            className="flex-1 bg-background px-5 pt-12"
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}
            <View className="flex-row items-center mb-8">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>
                <Text className="text-text text-2xl font-semibold">
                    Help & Support
                </Text>
            </View>

            {/* FAQ CARD */}
            <View className="bg-card rounded-3xl p-6 shadow-sm mb-6 gap-5">
                <Text className="text-text font-semibold text-lg">
                    Frequently Asked Questions
                </Text>

                <View>
                    <Text className="text-text font-medium">
                        Q.1  How does balance calculation work?
                    </Text>
                    <Text className="text-textLight mt-1">
                        We automatically calculate who owes whom based on shared expenses.
                    </Text>
                </View>

                <View>
                    <Text className="text-text font-medium">
                        Q2. Is my data secure?
                    </Text>
                    <Text className="text-textLight mt-1">
                        Yes. All authentication and password management is handled securely.
                    </Text>
                </View>
            </View>

            {/* CONTACT CARD */}
            <View className="bg-card rounded-3xl p-6 shadow-sm mb-10 gap-5">
                <Pressable
                    className="flex-row items-center justify-between"
                    onPress={() => Linking.openURL("mailto:tellawarved@gmail.com")}
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="mail-outline" size={18} color={COLORS.textLight} />
                        <Text className="text-text font-medium">
                            Contact Support
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={18} color={COLORS.text} />
                </Pressable>

                <View className="h-[0.5px] bg-border" />

                <Pressable
                    className="flex-row items-center justify-between"
                    onPress={() => Linking.openURL("mailto:tellawarved@gmail.com")}
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="chatbubble-outline" size={18} color={COLORS.textLight} />
                        <Text className="text-text font-medium">
                            Send Feedback
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={18} color={COLORS.text} />
                </Pressable>
            </View>
        </ScrollView>
    );
}
