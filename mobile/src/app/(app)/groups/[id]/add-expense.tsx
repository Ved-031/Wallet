import React from 'react'
import { cn } from '@/shared/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { SplitType } from '@/features/expenses/types';
import { router, useLocalSearchParams } from 'expo-router'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { SplitEditor } from '@/features/expenses/components/SplitEditor';
import { SplitTypeTabs } from '@/features/expenses/components/SplitTypeTabs';
import { useGetGroupDetails } from '@/features/groups/hooks/useGetGroupDetails';
import { useCreateGroupExpense } from '@/features/expenses/hooks/useCreateGroupExpense';
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'

const AddGroupExpenseScreen = () => {
    const { id } = useLocalSearchParams();
    const groupId = Number(id);

    const { data: me } = useCurrentUser();
    const { data: group } = useGetGroupDetails(groupId);
    const createExpense = useCreateGroupExpense(groupId);

    const [description, setDescription] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [paidBy, setPaidBy] = React.useState<number | null>(null);
    const [splitType, setSplitType] = React.useState<SplitType>('EQUAL');
    const [splits, setSplits] = React.useState<{ userId: number; amount: number; }[]>([]);
    const [errorMsg, setErrorMsg] = React.useState('');

    if (!group || !me) return null;

    const numericAmount = Number(amount || 0);

    const handleSubmit = async () => {
        if (!description.trim()) {
            setErrorMsg('Please enter a description');
            return;
        }

        if (!numericAmount || numericAmount <= 0) {
            setErrorMsg('Please enter a valid amount');
            return;
        }

        if (!paidBy) {
            setErrorMsg('Please select who paid');
            return;
        }

        const total = splits.reduce((sum, s) => sum + s.amount, 0);

        if (Number(total.toFixed(2)) !== Number(numericAmount.toFixed(2))) {
            setErrorMsg('Split amounts do not add up to the total amount');
            return;
        }

        try {
            await createExpense.mutateAsync({
                groupId,
                description,
                amount: numericAmount,
                paidBy,
                splitType,
                splits,
            });
            router.back();
        } catch (error) {
            setErrorMsg('Failed to create expense');
        } finally {
            setErrorMsg('');
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background"
        >
            {/* HEADER */}
            <View className="flex-row items-center justify-between p-5 mt-5">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>
                <Text className="text-text text-xl font-semibold">
                    Add Expense
                </Text>
                <Pressable
                    onPress={handleSubmit}
                    disabled={createExpense.isPending}
                    className="flex-row items-center gap-1 disabled:opacity-50"
                >
                    {createExpense.isPending
                        ? <ActivityIndicator />
                        : <View className='flex-row items-center gap-1'>
                            <Text className="text-primary font-semibold">Save</Text>
                            <Ionicons name="checkmark-outline" size={20} color={COLORS.primary} />
                        </View>
                    }
                </Pressable>
            </View>

            <View className="h-[1px] bg-border mb-2" />

            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                className='px-4'
            >
                {/* AMOUNT */}
                <View className="flex-row items-center p-4 pb-0 mb-5">
                    <Text className="text-[45px] font-bold text-text mr-2">₹</Text>
                    <TextInput
                        className="flex-1 text-[45px] text-text font-bold"
                        placeholder="0.00"
                        placeholderTextColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </View>

                {/* DESCRIPTION */}
                <View className="flex-row items-center border border-border rounded-xl p-1 mb-5 bg-white">
                    <Ionicons
                        name='create-outline'
                        size={22}
                        color={COLORS.textLight}
                        className="ml-3 mr-1"
                    />
                    <TextInput
                        className="flex-1 p-3 text-[16px] text-text"
                        placeholder="Dinner, Petrol, Rent..."
                        placeholderTextColor={COLORS.textLight}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* PAID BY */}
                <Text className="my-4 flex-row gap-2 items-center text-lg font-semibold text-text">
                    Paid By
                </Text>
                <View className="flex-row flex-wrap gap-[10px]">
                    {group.members.map(m => {
                        const selected = paidBy === m.userId;
                        return (
                            <Pressable
                                key={m.userId}
                                onPress={() => setPaidBy(m.userId)}
                                className={cn(
                                    'flex-row items-center px-4 py-2 rounded-full border border-border bg-white',
                                    selected && 'bg-primary border-primary'
                                )}
                            >
                                <Text className={`text-[14px] ${selected ? "text-white" : "text-text"}`}>
                                    {m.user.name}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>

                {/* SPLIT TYPE */}
                <Text className="my-4 mt-8 flex-row gap-2 items-center text-lg font-semibold text-text">
                    Split type
                </Text>
                <SplitTypeTabs
                    value={splitType}
                    onChange={setSplitType}
                />

                {/* SPLIT EDITOR */}
                <SplitEditor
                    members={group.members.map(m => ({
                        id: m.userId,
                        name: m.user.name,
                        avatar: m.user.avatar,
                    }))}
                    amount={numericAmount}
                    paidBy={paidBy ?? 0}
                    splitType={splitType}
                    onChange={setSplits}
                />

                {/* ERROR */}
                {!!errorMsg && (
                    <View className='flex-row items-center justify-between mt-6 bg-red-100 p-3 rounded-xl border border-red-200'>
                        <View className='flex-row items-center gap-2'>
                            <Ionicons name="alert-circle-outline" size={20} color={COLORS.expense} />
                            <Text className="text-red-600 font-semibold">{errorMsg}</Text>
                        </View>
                        <Pressable onPress={() => setErrorMsg('')}>
                            <Ionicons
                                name="close-circle-outline"
                                size={20}
                                color={COLORS.expense}
                            />
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default AddGroupExpenseScreen;
