import {
    Modal,
    View,
    Text,
    Pressable,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateSettlement } from '../hooks/useCreateSettlement';

type Props = {
    visible: boolean;
    onClose: () => void;
    groupId: number;
    userId: number;
    userName: string;
    amount: number;
};

export default function SettleUpModal({
    visible,
    onClose,
    groupId,
    userId,
    userName,
    amount,
}: Props) {
    const settlement = useCreateSettlement(groupId);
    const [value, setValue] = useState(amount.toString());

    useEffect(() => {
        setValue(amount.toString());
    }, [amount, visible]);

    const numericValue = Number(value);

    const isInvalid =
        isNaN(numericValue) ||
        numericValue <= 0 ||
        numericValue > amount;

    const handleConfirm = () => {
        if (isInvalid) return;

        settlement.mutate(
            {
                groupId,
                paidTo: userId,
                amount: numericValue,
            },
            {
                onSuccess: () => {
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
                <View className="flex-1 items-center justify-center px-6">
                    <View className="bg-card rounded-3xl p-6 w-full border border-border">
                        {/* ICON */}
                        <View className="items-center mb-4">
                            <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                                <Ionicons
                                    name="swap-horizontal-outline"
                                    size={26}
                                    color={COLORS.primary}
                                />
                            </View>
                        </View>

                        <Text className="text-text text-lg font-semibold text-center">
                            Settle with {userName}
                        </Text>

                        <Text className="text-textLight text-center mt-2">
                            You owe ₹{amount}
                        </Text>

                        {/* INPUT */}
                        <View className="mt-5">
                            <Text className="text-textLight mb-2">
                                Enter amount
                            </Text>

                            <TextInput
                                value={value}
                                onChangeText={setValue}
                                keyboardType="numeric"
                                className="border border-border rounded-xl px-4 py-3 text-text"
                            />

                            {isInvalid && (
                                <Text className="text-red-600 mt-2 text-sm">
                                    Enter valid amount (max ₹{amount})
                                </Text>
                            )}
                        </View>

                        {/* ACTIONS */}
                        <View className="flex-row gap-3 mt-6">
                            <Pressable
                                onPress={onClose}
                                disabled={settlement.isPending}
                                className="flex-1 border border-border py-3 rounded-xl items-center"
                            >
                                <Text className="text-text font-semibold">
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleConfirm}
                                disabled={settlement.isPending || isInvalid}
                                className="flex-1 bg-primary py-3 rounded-xl items-center"
                            >
                                {settlement.isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white font-semibold">
                                        Settle
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
