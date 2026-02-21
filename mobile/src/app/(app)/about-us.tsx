import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";

const LINKS = {
    portfolio: "https://vedtellawar.netlify.app",
    github: "https://github.com/Ved-031",
    linkedin: "https://linkedin.com/in/ved-tellawar",
    email: "mailto:tellawarved@gmail.com",
};

export default function AboutScreen() {
    const router = useRouter();

    const open = (url: string) => Linking.openURL(url);

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
                <Text className="text-text text-2xl font-semibold">About</Text>
            </View>

            {/* APP INTRO */}
            <View className="items-center mb-8">
                <Image
                    source={require("@assets/images/logo.png")}
                    className="w-24 h-24 rounded-full"
                    contentFit="contain"
                />
                <Text className="text-text text-2xl font-bold">
                    Split Wallet
                </Text>
                <Text className="text-textLight mt-1">Version 1.0.0</Text>
            </View>

            {/* APP DESCRIPTION */}
            <View className="bg-card rounded-3xl p-6 shadow-sm mb-6">
                <Text className="text-text font-semibold text-lg mb-2">
                    Why this app exists
                </Text>
                <Text className="text-text leading-6">
                    Split Wallet is built to remove awkward conversations about money.
                    Whether you're traveling with friends, living with roommates, or
                    managing group expenses, the app keeps everything transparent and fair.
                    No manual calculations. No confusion. No forgotten payments.
                </Text>
            </View>

            {/* HOW IT WORKS */}
            <View className="bg-card rounded-3xl p-6 shadow-sm mb-6">
                <Text className="text-text font-semibold text-lg mb-2">
                    How it works
                </Text>
                <Text className="text-textLight leading-6">
                    • Add expenses to a group{"\n"}
                    • Automatically split bills{"\n"}
                    • Track who owes whom{"\n"}
                    • Settle instantly and stay balanced
                </Text>
            </View>

            {/* DEVELOPER */}
            <View className="bg-card rounded-3xl p-6 shadow-sm mb-6">
                <Text className="text-text font-semibold text-lg mb-2">
                    About the Developer
                </Text>
                <Text className="text-text leading-6">
                    Hi 👋 I'm Ved Tellawar, a Computer Engineering student and full-stack
                    developer passionate about building real-world products.
                    I created Split Wallet to solve a problem I personally faced while
                    managing shared expenses with friends.
                </Text>
            </View>

            {/* SOCIAL LINKS */}
            <View className="bg-card rounded-3xl p-6 shadow-sm gap-5">
                <Text className="text-text font-semibold text-lg">
                    Connect with me
                </Text>

                <Pressable className="flex-row justify-between" onPress={() => open(LINKS.portfolio)}>
                    <Text className="text-text">Portfolio</Text>
                    <Ionicons name="open-outline" size={18} color={COLORS.text} />
                </Pressable>

                <Pressable className="flex-row justify-between" onPress={() => open(LINKS.github)}>
                    <Text className="text-text">GitHub</Text>
                    <Ionicons name="logo-github" size={18} color={COLORS.text} />
                </Pressable>

                <Pressable className="flex-row justify-between" onPress={() => open(LINKS.linkedin)}>
                    <Text className="text-text">LinkedIn</Text>
                    <Ionicons name="logo-linkedin" size={18} color={COLORS.text} />
                </Pressable>

                <Pressable className="flex-row justify-between" onPress={() => open(LINKS.email)}>
                    <Text className="text-text">Contact</Text>
                    <Ionicons name="mail-outline" size={18} color={COLORS.text} />
                </Pressable>
            </View>
        </ScrollView>
    );
}
