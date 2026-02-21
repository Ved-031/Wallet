import { cn } from "@/shared/utils/cn";
import { IoniconName } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Action = {
    label: string;
    icon: IoniconName;
    onPress: () => void;
    highlight?: boolean;
}

const ACTIONS: Action[] = [
    {
        label: 'Add',
        icon: 'receipt-outline',
        onPress: () => router.push('/transactions/create'),
    },
    {
        label: 'Split',
        icon: 'people-outline',
        onPress: () => router.push('/groups/create-expense'),
    },
    {
        label: 'Settle',
        icon: 'swap-horizontal-outline',
        onPress: () => router.push('/settlements/create'),
    },
    {
        label: 'History',
        icon: 'time-outline',
        onPress: () => router.push('/activity'),
    },
];

const ActionTile = ({ action }: { action: Action }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <Animated.View style={animatedStyle} className="flex-1">
            <Pressable
                onPressIn={() => (scale.value = withSpring(0.95))}
                onPressOut={() => (scale.value = withSpring(1))}
                onPress={action.onPress}
                className={cn(
                    'h-[78px] rounded-2xl items-center justify-center bg-card border border-border/65',
                    action.highlight && 'shadow-sm'
                )}
            >
                <Ionicons
                    name={action.icon}
                    size={28}
                    color="#4A3428"
                />
                <Text className="mt-1 text-[14px] font-medium text-text">
                    {action.label}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

export const QuickActions = () => {
    return (
        <View className="my-8">
            <View className="flex-row gap-3">
                <ActionTile action={ACTIONS[0]} />
                <ActionTile action={ACTIONS[1]} />
            </View>
            <View className="flex-row gap-3 mt-3">
                <ActionTile action={ACTIONS[2]} />
                <ActionTile action={ACTIONS[3]} />
            </View>
        </View>
    );
};
