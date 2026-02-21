import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const DashboardHeader = () => {
    const { user } = useUser();

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
            <TouchableOpacity className='relative'>
                <Ionicons
                    name='notifications-outline'
                    size={26}
                    color='#4A3428'
                />
                <View className='absolute -top-1 -right-1 bg-text w-5 h-5 rounded-full flex items-center justify-center'>
                    <Text className='text-white text-xs'>3</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
