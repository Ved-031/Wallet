import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { View, Text, Pressable } from 'react-native';

type Props = {
    name: string;
    isAdmin: boolean;
    onLeave: () => void;
    onDelete: () => void;
};

export const GroupHeader = ({ name, isAdmin, onLeave, onDelete }: Props) => {
    return (
        <View className="flex-row items-center justify-between px-5 pt-8 pb-5">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </Pressable>

            <Text className="text-text text-2xl font-semibold">
                {name}
            </Text>

            {isAdmin ? (
                <Pressable onPress={onDelete}>
                    <Ionicons name="trash-outline" size={22} color={COLORS.expense} />
                </Pressable>
            ) : (
                <Pressable onPress={onLeave}>
                    <Ionicons name="exit-outline" size={22} color={COLORS.expense} />
                </Pressable>
            )}
        </View>
    );
};
