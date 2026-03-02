import dayjs from "@/shared/utils/dayjs";
import { View, Text, Image } from "react-native";

export default function PendingInviteRow({ invite }: any) {
    return (
        <View className="flex-row items-center justify-between py-3">

            <View className="flex-row items-center gap-3">
                <Image
                    source={
                        invite.invitedUser.avatar
                            ? { uri: invite.invitedUser.avatar }
                            : require("@assets/images/logo.png")
                    }
                    className="w-10 h-10 rounded-full"
                />

                <View>
                    <Text className="text-text font-medium">
                        {invite.invitedUser.name || invite.invitedUser.email}
                    </Text>

                    <Text className="text-textLight text-sm">
                        Invited • {dayjs(invite.createdAt).fromNow()}
                    </Text>
                </View>
            </View>

            <Text className="text-textLight text-sm">
                Pending
            </Text>
        </View>
    );
}
