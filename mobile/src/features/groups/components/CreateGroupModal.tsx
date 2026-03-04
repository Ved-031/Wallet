import {
    Modal,
    View,
    Text,
    Pressable,
    ActivityIndicator,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useCreateGroup } from '../hooks/useCreateGroup';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export default function CreateGroupModal({
    visible,
    onClose,
}: Props) {
    const [name, setName] = useState('');
    const createGroup = useCreateGroup();

    const isInvalid = name.trim().length < 2;

    const handleCreate = () => {
        if (isInvalid) return;

        createGroup.mutate(
            name.trim(),
            {
                onSuccess: () => {
                    setName('');
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
                                        name="people-outline"
                                        size={26}
                                        color={COLORS.primary}
                                    />
                                </View>
                            </View>

                            {/* TITLE */}
                            <Text className="text-text text-lg font-semibold text-center">
                                Create New Group
                            </Text>

                            <Text className="text-textLight text-center mt-1">
                                Add a name for your group
                            </Text>

                            {/* INPUT */}
                            <View className="mt-5">
                                <Text className="text-textLight mb-2">
                                    Group name
                                </Text>

                                <TextInput
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="e.g. Goa Trip"
                                    placeholderTextColor={COLORS.textLight}
                                    autoFocus
                                    className="border border-border rounded-xl px-4 py-3 text-text"
                                />

                                {isInvalid && name.length > 0 && (
                                    <Text className="text-red-600 mt-2 text-sm">
                                        Group name must be at least 2 characters
                                    </Text>
                                )}
                            </View>

                            {/* ACTIONS */}
                            <View className="flex-row gap-3 mt-6">
                                <Pressable
                                    onPress={onClose}
                                    disabled={createGroup.isPending}
                                    className="flex-1 border border-border py-3 rounded-xl items-center"
                                >
                                    <Text className="text-text font-semibold">
                                        Cancel
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={handleCreate}
                                    disabled={createGroup.isPending || isInvalid}
                                    className="flex-1 bg-primary py-3 rounded-xl items-center"
                                >
                                    {createGroup.isPending ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-white font-semibold">
                                            Create
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
