import {
    View,
    Text,
    Modal,
    Platform,
    TextInput,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useSendInvite } from '../hooks/useSendInvite';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    visible: boolean;
    groupId: number;
    onClose: () => void;
};

export default function InviteMemberModal({
    visible,
    groupId,
    onClose,
}: Props) {
    const [email, setEmail] = useState('');
    const inviteMutation = useSendInvite(groupId);

    const isInvalid = email.trim().length < 2 && !email.includes('@');

    const handleInvite = () => {
        if (isInvalid) return;

        inviteMutation.mutate(
            email.trim(),
            {
                onSuccess: () => {
                    setEmail('');
                    onClose();
                },
            }
        );
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 items-center justify-center px-6">
                        <View className="bg-card rounded-3xl p-6 w-full border border-border">
                            {/* ICON */}
                            <View className="items-center mb-2">
                                <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                                    <Ionicons
                                        name="person-add-outline"
                                        size={26}
                                        color={COLORS.primary}
                                    />
                                </View>
                            </View>

                            {/* TITLE */}
                            <Text className="text-text text-lg font-semibold text-center">
                                Invite a member
                            </Text>

                            {/* INPUT */}
                            <View className="mt-5">
                                <Text className="text-textLight mb-2">
                                    Member email address
                                </Text>

                                <TextInput
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="e.g. john_doe@example.com"
                                    placeholderTextColor={COLORS.textLight}
                                    autoFocus
                                    autoCapitalize="none"
                                    className="border border-border rounded-xl px-4 py-3 text-text"
                                />

                                {isInvalid && email.length > 0 && (
                                    <Text className="text-red-600 mt-2 text-sm">
                                        Invalid email
                                    </Text>
                                )}
                            </View>

                            {/* ACTIONS */}
                            <View className="flex-row gap-3 mt-6">
                                <Pressable
                                    onPress={onClose}
                                    disabled={inviteMutation.isPending}
                                    className="flex-1 border border-border py-3 rounded-xl items-center"
                                >
                                    <Text className="text-text font-semibold">
                                        Cancel
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleInvite}
                                    disabled={inviteMutation.isPending || isInvalid}
                                    className="flex-1 bg-primary py-3 rounded-xl items-center"
                                >
                                    {inviteMutation.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-semibold">
                                            Send Invite
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
