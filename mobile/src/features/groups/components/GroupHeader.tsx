import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useLeaveGroup } from '../hooks/useLeaveGroup';
import { useDeleteGroup } from '../hooks/useDeleteGroup';
import { getErrorMessage } from '@/shared/utils/getErrorMsg';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';

type Props = {
    name: string;
    groupId: number;
    isAdmin: boolean;
    setLeaveGroupError: (msg: string) => void;
    setDeleteGroupError: (msg: string) => void;
};

export const GroupHeader = ({ name, isAdmin, groupId, setLeaveGroupError, setDeleteGroupError }: Props) => {
    const leaveMutation = useLeaveGroup();
    const deleteMutation = useDeleteGroup();

    const handleLeave = async () => {
        await leaveMutation.mutateAsync(groupId, {
            onSuccess: () => {
                setLeaveGroupError('');
            },
            onError: (error) => {
                setLeaveGroupError(getErrorMessage(error));
            }
        });
        router.replace('/(app)/(tabs)/groups');
    }

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(groupId, {
            onSuccess: () => {
                setDeleteGroupError('');
            },
            onError: (error) => {
                setDeleteGroupError(getErrorMessage(error));
            }
        });
        router.replace('/(app)/(tabs)/groups');
    }

    return (
        <View className="flex-row items-center justify-between px-5 pt-8 pb-5">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </Pressable>

            <Text className="text-text text-2xl font-semibold">
                {name}
            </Text>

            {isAdmin ? (
                <Pressable onPress={handleDelete}>
                    {deleteMutation.isPending ? (
                        <ActivityIndicator size={'small'} color={COLORS.primary} />
                    ) : (
                        <Ionicons name="trash-outline" size={22} color={COLORS.expense} />
                    )}
                </Pressable>
            ) : (
                <Pressable onPress={handleLeave}>
                    {leaveMutation.isPending ? (
                        <ActivityIndicator size={'small'} color={COLORS.primary} />
                    ) : (
                        <Ionicons name="exit-outline" size={22} color={COLORS.expense} />
                    )}
                </Pressable>
            )}
        </View>
    );
};
