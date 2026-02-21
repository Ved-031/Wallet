import { IoniconName } from '@/types';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmptyState({
    icon = 'wallet-outline',
    title,
    subtitle,
}: {
    icon?: IoniconName;
    title: string;
    subtitle: string;
}) {
    return (
        <View className="bg-card rounded-2xl p-5 py-10 shadow-sm items-center justify-center mt-2 shadow-shadow">
            <Ionicons
                name={icon}
                size={45}
                color="#9A8478"
            />
            <Text className="text-text text-lg font-semibold">{title}</Text>
            <Text className="text-textLight text-center px-8">{subtitle}</Text>
        </View>
    );
}
