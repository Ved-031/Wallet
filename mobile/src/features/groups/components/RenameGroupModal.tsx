import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRenameGroup } from '../hooks/useRenameGroup';

type Props = {
    visible: boolean;
    onClose: () => void;
    groupId: number;
    currentName: string;
};

export default function RenameGroupModal({
    visible,
    onClose,
    groupId,
    currentName,
}: Props) {
    const [name, setName] = useState(currentName);

    const rename = useRenameGroup(groupId);

    const isInvalid = !name.trim() || name.trim().length < 2;

    const handleConfirm = () => {
        if (isInvalid) return;

        rename.mutate(name.trim(), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View className="flex-1 items-center justify-center px-6">
                    <View className="bg-card rounded-3xl p-6 w-full border border-border">
                        {/* ICON */}
                        <View className="items-center mb-4">
                            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                                <Ionicons
                                    name="pencil-outline"
                                    size={26}
                                    color={COLORS.primary}
                                />
                            </View>
                        </View>

                        {/* TITLE */}
                        <Text className="text-text text-lg font-semibold text-center">
                            Rename Group
                        </Text>

                        {/* INPUT */}
                        <View className="mt-5">
                            <Text className="text-textLight mb-2">Group name</Text>

                            <TextInput
                                value={name}
                                onChangeText={setName}
                                className="border border-border rounded-xl px-4 py-3 text-text"
                            />
                        </View>

                        {/* ACTIONS */}
                        <View className="flex-row gap-3 mt-6">
                            <Pressable
                                onPress={onClose}
                                disabled={rename.isPending}
                                className="flex-1 border border-border py-3 rounded-xl items-center"
                            >
                                <Text className="text-text font-semibold">
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleConfirm}
                                disabled={rename.isPending || isInvalid}
                                className="flex-1 bg-primary py-3 rounded-xl items-center"
                            >
                                {rename.isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold">
                                        Rename
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
}
