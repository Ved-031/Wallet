import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import ErrorBanner from "@/shared/components/ErrorBanner";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export default function ChangePasswordScreen() {
    const router = useRouter();
    const { user } = useUser();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validate = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMsg("All fields are required");
            return false;
        }

        if (newPassword.length < 8) {
            setErrorMsg("Password must be at least 8 characters");
            return false;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return false;
        }

        return true;

    };

    const handleChangePassword = async () => {
        if (!validate() || !user) return;

        try {
            setLoading(true);

            await user.updatePassword({
                currentPassword,
                newPassword,
            });

            Alert.alert("Success", "Password updated successfully");
            router.back();
        } catch (err: any) {
            Alert.alert("Error", err.errors?.[0]?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background px-5 pt-12"
        >
            {/* HEADER */}
            <View className="flex-row items-center mb-8">
                <Pressable onPress={() => router.back()} className="mr-3">
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>

                <Text className="text-text text-2xl font-semibold">
                    Change Password
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* CURRENT PASSWORD */}
                <View className="mb-5">
                    <Text className="text-textLight mb-2 font-medium">Current Password</Text>
                    <View className="flex-row items-center bg-card w-full border border-border rounded-xl px-4 py-1">
                        <TextInput
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showCurrentPassword}
                            placeholder="Current Password"
                            placeholderTextColor={COLORS.textLight}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            className="text-text flex-1"
                        />
                        <Pressable onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <Ionicons
                                name={showCurrentPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color={COLORS.textLight}
                            />
                        </Pressable>
                    </View>
                </View>

                {/* NEW PASSWORD */}
                <View className="mb-5">
                    <Text className="text-textLight mb-2 font-medium">New Password</Text>
                    <View className="flex-row items-center bg-card w-full border border-border rounded-xl px-4 py-1">
                        <TextInput
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            placeholder="New Password"
                            placeholderTextColor={COLORS.textLight}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            className="text-text flex-1"
                        />
                        <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Ionicons
                                name={showNewPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color={COLORS.textLight}
                            />
                        </Pressable>
                    </View>
                </View>

                {/* NEW PASSWORD */}
                <View className="mb-5">
                    <Text className="text-textLight mb-2 font-medium">Confirm Password</Text>
                    <View className="flex-row items-center bg-card w-full border border-border rounded-xl px-4 py-1">
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholder="Confirm Password"
                            placeholderTextColor={COLORS.textLight}
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            className="text-text flex-1"
                        />
                        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons
                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color={COLORS.textLight}
                            />
                        </Pressable>
                    </View>
                </View>

                {/* ERROR MSG */}
                {!!errorMsg && <ErrorBanner errorMsg={errorMsg} setErrorMsg={setErrorMsg} />}

                {/* RULES */}
                <View className="mb-6">
                    <Text className="text-textLight text-sm">• At least 8 characters</Text>
                    <Text className="text-textLight text-sm">• Include a number</Text>
                    <Text className="text-textLight text-sm">• Include uppercase letter</Text>
                </View>

                {/* BUTTON */}
                <Pressable
                    onPress={handleChangePassword}
                    disabled={loading}
                    className="bg-primary py-4 rounded-2xl items-center"
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text className="text-white font-semibold text-base">
                            Update Password
                        </Text>
                    )}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>

    );
}
