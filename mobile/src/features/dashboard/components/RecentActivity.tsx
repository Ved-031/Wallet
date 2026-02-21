import { router } from "expo-router";
import { ActivityItem } from "./ActivityItem";
import { ActivityUI } from "@/features/activity/types";
import EmptyState from "@/shared/components/EmptyState";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useActivityPreview } from "@/features/activity/hooks/useActivityPreview";
import { useDeleteTransaction } from "@/features/transactions/hook/useDeleteTransaction";

export const RecentActivity = () => {
    const { mutateAsync } = useDeleteTransaction();
    const { data, isLoading } = useActivityPreview();

    if (isLoading) {
        return (
            <View className="py-6 items-center">
                <ActivityIndicator />
            </View>
        )
    }

    const activities = data.data;

    const handleDelete = (item: ActivityUI) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this transaction?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const numericId = Number(item.id.replace('txn_', ''));
                            await mutateAsync(numericId);
                        } catch (e) {
                            Alert.alert('Error', 'Failed to delete transaction. Please try again.');
                        }
                    },
                },
            ]
        )
    }

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
                        onEdit={(item) => router.push({
                            pathname: '/(app)/transactions/edit/[id]',
                            params: { id: item.id },
                        })}
                        onDelete={(item) => handleDelete(item)}
                    />
                ))}
            </View>
        </View>
    )
};
