import { cn } from "@/shared/utils/cn";
import { Notification } from "../types";
import dayjs from "@/shared/utils/dayjs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { View, Text, Pressable, Image } from "react-native";
import { useReadNotification } from "../hooks/useReadNotification";
import { useRespondInvite } from "@/features/invites/hooks/useRespondInvite";

const buildMessage = (item: Notification) => {
    switch (item.type) {
        case "GROUP_INVITE":
            return `invited you to join ${item.groupName}`;

        case "INVITE_ACCEPTED":
            return `${item.actorName} joined ${item.groupName}`;

        case "INVITE_DECLINED":
            return `${item.actorName} declined your invite to ${item.groupName}`;

        case "SETTLEMENT":
            return item.message;

        default:
            return item.message;
    }
}

export const NotificationCard = ({ item }: { item: Notification }) => {
    const { readOne } = useReadNotification();
    const { accept, decline } = useRespondInvite();

    const isActionableInvite = item.type === "GROUP_INVITE" && item.inviteId;

    const handlePress = () => {
        if (!item.read) readOne.mutate(item.id);
    };

    return (
        <Pressable
            onPress={handlePress}
            className={cn(
                "mx-4 mb-3 rounded-2xl p-4 border border-border",
                item.read ? "bg-card" : "bg-primary/5 border-primary/20"
            )}
        >
            {/* HEADER */}
            <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                    {item.actorAvatar ? (
                        <Image
                            source={{ uri: item.actorAvatar }}
                            className="w-10 h-10 rounded-full"
                        />
                    ) : (
                        <Ionicons
                            name={isActionableInvite ? "people-outline" : "notifications-outline"}
                            size={18}
                            color={COLORS.primary}
                        />
                    )}
                </View>

                <View className="flex-1">
                    <Text className="text-text font-semibold">
                        {item.title}
                    </Text>

                    <Text className="text-textLight mt-1">
                        {buildMessage(item)}
                    </Text>

                    <Text className="text-textLight text-xs mt-2">
                        {dayjs(item.createdAt).fromNow()}
                    </Text>
                </View>

                {!item.read && (
                    <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                )}
            </View>

            {/* INVITE ACTIONS */}
            {isActionableInvite && (
                <View className="flex-row gap-3 mt-4">
                    <Pressable
                        onPress={() => accept.mutate(item.id)}
                        className="flex-1 bg-primary py-3 rounded-xl items-center"
                    >
                        <Text className="text-white font-semibold">Accept</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => decline.mutate(item.id)}
                        className="flex-1 border border-border py-3 rounded-xl items-center"
                    >
                        <Text className="text-text font-semibold">Decline</Text>
                    </Pressable>
                </View>
            )}
        </Pressable>
    );
};
