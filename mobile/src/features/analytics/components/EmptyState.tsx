import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";

interface EmptyStateProps {
    message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
    return (
        <View className='items-center py-9 gap-2'>
            <Ionicons
                name='bar-chart-outline'
                color={COLORS.textLight}
                size={48}
            />
            <Text className='text-textLight text-[14px] text-center'>
                {message}
            </Text>
        </View>
    );
}
