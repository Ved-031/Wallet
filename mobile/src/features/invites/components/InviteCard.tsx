import { InviteUI } from "../types";
import { formatDistanceToNow } from "date-fns";
import { View, Text, Image, Pressable } from "react-native";
import { useRespondInvite } from "../hooks/useRespondInvite";

export const InviteCard = ({ invite }: any) => {
    const { accept, decline } = useRespondInvite();

    const accepting = accept.isPending && accept.variables === invite.id;
    const declining = decline.isPending && decline.variables === invite.id;

    return (
        <View className="bg-card border border-border rounded-2xl p-4 mb-3">
            {/* TOP */}
            <View className="flex-row items-center gap-3">
                <Image
                    source={{ uri: invite.invitedBy.avatar }}
                    className="w-10 h-10 rounded-full"
                />

                <View className="flex-1">
                    <Text className="text-text font-semibold">
                        {invite.invitedBy.name}
                    </Text>
                    <Text className="text-textLight text-sm">
                        invited you to
                    </Text>
                    <Text className="text-text font-medium">
                        {invite.groupName}
                    </Text>
                </View>
            </View>

            {/* TIME */}
            <Text className="text-textLight text-xs mt-2">
                {formatDistanceToNow(new Date(invite.createdAt))} ago
            </Text>

            {/* ACTIONS */}
            <View className="flex-row gap-3 mt-4">
                <Pressable
                    disabled={accepting || declining}
                    onPress={() => accept.mutate(invite.id)}
                    className="flex-1 bg-primary py-3 rounded-xl items-center disabled:opacity-50"
                >
                    <Text className="text-white font-semibold">Accept</Text>
                </Pressable>

                <Pressable
                    disabled={accepting || declining}
                    onPress={() => decline.mutate(invite.id)}
                    className="flex-1 border border-border py-3 rounded-xl items-center disabled:opacity-50"
                >
                    <Text className="text-text font-semibold">Decline</Text>
                </Pressable>
            </View>
        </View>
    );
};
