import React from 'react';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useLeaveGroup } from '../hooks/useLeaveGroup';
import { useDeleteGroup } from '../hooks/useDeleteGroup';
import ConfirmModal from '@/shared/components/ConfirmModal';
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
    const [confirmLeave, setConfirmLeave] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);

    const leaveMutation = useLeaveGroup();
    const deleteMutation = useDeleteGroup();

    const handleLeave = async () => {
        await leaveMutation.mutateAsync(groupId, {
            onSuccess: () => {
                setLeaveGroupError('');
                setConfirmLeave(false);
            },
            onError: (error) => {
                setLeaveGroupError(getErrorMessage(error));
                setConfirmLeave(false);
            }
        });
        router.replace('/(app)/(tabs)/groups');
    }

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(groupId, {
            onSuccess: () => {
                setDeleteGroupError('');
                setConfirmDelete(false);
            },
            onError: (error) => {
                setDeleteGroupError(getErrorMessage(error));
                setConfirmDelete(false);
            }
        });
        router.replace('/(app)/(tabs)/groups');
    }

    return (
        <>
            <View className="flex-row items-center justify-between px-5 pt-8 pb-5">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>

                <Text className="text-text text-2xl font-semibold">
                    {name}
                </Text>

                {isAdmin ? (
                    <Pressable onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setConfirmDelete(true);
                    }}>
                        {deleteMutation.isPending ? (
                            <ActivityIndicator size={'small'} color={COLORS.primary} />
                        ) : (
                            <Ionicons name="trash" size={22} color={COLORS.expense} />
                        )}
                    </Pressable>
                ) : (
                    <Pressable onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setConfirmLeave(true);
                    }}>
                        {leaveMutation.isPending ? (
                            <ActivityIndicator size={'small'} color={COLORS.primary} />
                        ) : (
                            <Ionicons name="exit" size={22} color={COLORS.expense} />
                        )}
                    </Pressable>
                )}
            </View>
            {isAdmin ? (
                <ConfirmModal
                    visible={confirmDelete}
                    variant="danger"
                    title="Delete Group?"
                    description="This action cannot be undone."
                    confirmText="Delete"
                    loading={deleteMutation.isPending}
                    onCancel={() => setConfirmDelete(false)}
                    onConfirm={handleDelete}
                />
            ) : (
                <ConfirmModal
                    visible={confirmLeave}
                    title="Leave Group?"
                    description="You can only leave if all balances are settled."
                    confirmText="Leave"
                    loading={leaveMutation.isPending}
                    onCancel={() => setConfirmLeave(false)}
                    onConfirm={handleLeave}
                />
            )}
        </>
    );
};
