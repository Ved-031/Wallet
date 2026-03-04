import React from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { IoniconName } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    visible: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    icon?: IoniconName;
    variant?: 'danger' | 'default';
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    visible,
    title,
    description,
    icon,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    loading = false,
    onConfirm,
    onCancel,
}: Props) {
    const isDanger = variant === 'danger';

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <View className='flex-1 items-center justify-center px-6'>
                    <View className="bg-card rounded-3xl p-6 w-full border border-border">

                        {/* ICON */}
                        <View className="items-center mb-4">
                            <View
                                className={`w-14 h-14 rounded-full items-center justify-center ${isDanger ? 'bg-red-100' : 'bg-primary/10'
                                    }`}
                            >
                                <Ionicons
                                    name={icon ?? isDanger
                                        ? 'warning-outline'
                                        : 'help-circle-outline'
                                    }
                                    size={26}
                                    color={
                                        isDanger
                                            ? COLORS.expense
                                            : COLORS.primary
                                    }
                                />
                            </View>
                        </View>

                        {/* TITLE */}
                        <Text className="text-text text-lg font-semibold text-center">
                            {title}
                        </Text>

                        {/* DESCRIPTION */}
                        {description && (
                            <Text className="text-textLight text-center mt-2">
                                {description}
                            </Text>
                        )}

                        {/* ACTIONS */}
                        <View className="flex-row gap-3 mt-6">
                            {/* CANCEL */}
                            <Pressable
                                onPress={onCancel}
                                disabled={loading}
                                className="flex-1 border border-border py-3 rounded-xl items-center"
                            >
                                <Text className="text-text font-semibold">
                                    {cancelText}
                                </Text>
                            </Pressable>

                            {/* CONFIRM */}
                            <Pressable
                                onPress={onConfirm}
                                disabled={loading}
                                className={`flex-1 py-3 rounded-xl items-center ${isDanger ? 'bg-red-600' : 'bg-primary'
                                    }`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold">
                                        {confirmText}
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
