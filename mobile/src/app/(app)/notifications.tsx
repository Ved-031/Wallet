import { COLORS } from "@/shared/constants/colors";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { NotificationCard } from "@/features/notifications/components/NotificationCard";
import { useReadNotification } from "@/features/notifications/hooks/useReadNotification";
import { useGetNotifications } from "@/features/notifications/hooks/useGetNotifications";

export default function NotificationsScreen() {
    const { readAll } = useReadNotification();
    const { data, isLoading } = useGetNotifications();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Text className="text-textLight">No notifications yet</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background pt-10 px-1">
            {/* HEADER */}
            <View className="px-5 mb-4 flex-row items-center justify-between">
                <Text className="text-3xl font-semibold text-text">
                    Notifications
                </Text>

                <Pressable onPress={() => readAll.mutate()}>
                    <Text className="text-primary font-medium">
                        Mark all read
                    </Text>
                </Pressable>
            </View>

            <View className="mt-5">
                <FlatList
                    data={data}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <NotificationCard item={item} />}
                />
            </View>
        </View>
    );
}
