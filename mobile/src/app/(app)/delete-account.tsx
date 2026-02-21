import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { View, Text, Pressable, Alert, ActivityIndicator } from "react-native";

export default function DeleteAccountScreen() {
    const router = useRouter();
    const { user } = useUser();
    const { signOut } = useClerk();
    const [loading, setLoading] = useState(false);

    const confirmDelete = () => {
        Alert.alert(
            "Delete Account",
            "This action is permanent. All your expenses, groups and history will be deleted.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: handleDelete,
                },
            ]
        );
    };

    const handleDelete = async () => {
        if (!user) return;
        try {
            setLoading(true);
            await user.delete();
            await signOut();
        } catch (err) {
            Alert.alert("Error", "Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-background px-5 pt-12">

            {/* HEADER */}
            <View className="flex-row items-center mb-8">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>

                <Text className="text-text text-2xl font-semibold">
                    Delete Account
                </Text>
            </View>

            <View className="bg-card rounded-3xl p-6 shadow-sm mb-8">
                <Text className="text-red-500 font-semibold text-lg mb-3">
                    This action cannot be undone
                </Text>

                <Text className="text-textLight leading-6">
                    Deleting your account will permanently remove:
                    {"\n\n"}
                    • All groups
                    {"\n"}
                    • All expenses
                    {"\n"}
                    • All balances
                    {"\n"}
                    • All personal transactions
                </Text>
            </View>

            <Pressable
                onPress={confirmDelete}
                disabled={loading}
                className="bg-red-500 py-4 rounded-2xl items-center"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-semibold text-base">
                        Permanently Delete Account
                    </Text>
                )}
            </Pressable>
        </View>
    );
}
