import { router } from "expo-router";
import { ActivityItem } from "./ActivityItem";
import { ActivityUI } from "@/features/activity/types";
import EmptyState from "@/shared/components/EmptyState";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useActivityPreview } from "@/features/activity/hooks/useActivityPreview";

export const RecentActivity = () => {
    const { data, isLoading } = useActivityPreview();

    if (isLoading) {
        return (
            <View className="py-6 items-center">
                <ActivityIndicator />
            </View>
        )
    }

    const activities = data.data;

    if (activities.length === 0) {
        return (
            <EmptyState
                icon="hourglass-outline"
                title="No activity yet"
                subtitle="Your expenses and settlements will appear here."
            />
        )
    }

    return (
        <View className="px-1">
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-semibold text-text">
                    Recent Activity
                </Text>
                <Pressable onPress={() => router.push('/activity')}>
                    <Text className="text-sm text-textLight">
                        See all
                    </Text>
                </Pressable>
            </View>

            <View>
                {activities.map((activity: ActivityUI) => (
                    <ActivityItem
                        key={activity.id}
                        item={activity}
                        showDate={false}
                    />
                ))}
            </View>
        </View>
    )
};
