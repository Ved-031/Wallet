import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useUnreadCount } from "@/features/notifications/hooks/useUnreadCount";

export const DashboardHeader = () => {
    const { user } = useUser();
    const unread = useUnreadCount();

    return (
        <View className='flex flex-row items-center justify-between mb-5 px-0 py-3'>
            {/* LEFT */}
            <View className='flex-1 flex-row items-center'>
                <Image
                    source={require("@assets/images/logo.png")}
                    className='w-[65px] h-[65px]'
                    resizeMode='contain'
                />
                <View className='flex-1'>
                    <Text className='text-[18px] text-textLight font-regular'>
                        Welcome,
                    </Text>
                    <Text className='text-[20px] font-semibold text-text'>
                        {user?.fullName
                            ? user.fullName
                            : user?.emailAddresses[0].emailAddress.split("@")[0]
                        }
                    </Text>
                </View>
            </View>

            {/* RIGHT */}
            <TouchableOpacity
                className='relative'
                onPress={() => router.push('/(app)/notifications')}
            >
                <Ionicons
                    name={unread > 0 ? 'notifications' : 'notifications-outline'}
                    size={26}
                    color='#4A3428'
                />
                {unread >  0 && (
                    <View className='absolute -top-1 -right-1 bg-text w-5 h-5 rounded-full flex items-center justify-center'>
                        <Text className='text-white text-xs'>
                            {unread}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
}
