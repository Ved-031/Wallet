import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/shared/constants/colors';
import { useCallback, useRef, useState } from 'react';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { GroupHeader } from '@/features/groups/components/GroupHeader';
import { mapGroupExpenseToUI } from '@/features/groups/mapGroupExpense';
import GroupActionSheet from '@/features/groups/components/GroupActionSheet';
import { useGetGroupDetails } from '@/features/groups/hooks/useGetGroupDetails';
import { GroupExpenseItem } from '@/features/groups/components/GroupExpenseItem';
import { useGetGroupExpenses } from '@/features/groups/hooks/useGetGroupExpenses';
import { MyBalancesSection } from '@/features/groups/components/MyBalancesSection';
import GroupMembersSection from '@/features/groups/components/GroupMembersSection';
import { ActivityIndicator, View, Text, Pressable, ScrollView } from 'react-native';

export default function GroupDetailsScreen() {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [leaveGroupError, setLeaveGroupError] = useState<string | null>(null);
    const [deleteGroupError, setDeleteGroupError] = useState<string | null>(null);

    const openBottomSheet = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        bottomSheetRef.current?.expand();
    }, []);

    const { id } = useLocalSearchParams();
    const groupId = Number(id);

    const { data: user } = useCurrentUser();
    const { data: group, isLoading } = useGetGroupDetails(groupId);
    const { data: expenseRes, isLoading: isLoadingExpenses } = useGetGroupExpenses(groupId);

    const expenses = expenseRes?.data?.map(exp => mapGroupExpenseToUI(exp, user?.id ?? 0)) ?? [];

    if (isLoading || isLoadingExpenses || !group) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size={'small'} color={COLORS.primary} />
            </View>
        );
    }

    const isAdmin = group.members.find(
        m => m.userId === Number(user?.id)
    )?.role === 'ADMIN';

    return (
        <>
            <View className="flex-1 bg-background">
                <GroupHeader
                    name={group.name}
                    isAdmin={isAdmin}
                    groupId={groupId}
                    setLeaveGroupError={setLeaveGroupError}
                    setDeleteGroupError={setDeleteGroupError}
                />

                <View className='border-b-[0.5px] border-border mb-6' />

                {!!leaveGroupError && (
                    <View className='px-5 mb-4'>
                        <View className='flex-row items-center justify-between bg-expense/10 px-4 py-2 rounded-lg'>
                            <View className='flex-row items-center gap-1'>
                                <Ionicons
                                    name='alert-circle-outline'
                                    size={20}
                                    color={COLORS.expense}
                                />
                                <Text className='text-expense font-medium'>
                                    {leaveGroupError}
                                </Text>
                            </View>
                            <Pressable onPress={() => setLeaveGroupError('')}>
                                <Ionicons
                                    name='close'
                                    size={20}
                                    color={COLORS.expense}
                                />
                            </Pressable>
                        </View>
                    </View>
                )}

                {!!deleteGroupError && (
                    <View className='px-5 mb-4'>
                        <View className='flex-row items-center justify-between bg-expense/10 px-4 py-2 rounded-lg'>
                            <View className='flex-row items-center gap-1'>
                                <Ionicons
                                    name='alert-circle-outline'
                                    size={20}
                                    color={COLORS.expense}
                                />
                                <Text className='text-expense font-medium'>
                                    {deleteGroupError}
                                </Text>
                            </View>
                            <Pressable onPress={() => setDeleteGroupError('')}>
                                <Ionicons
                                    name='close'
                                    size={20}
                                    color={COLORS.expense}
                                />
                            </Pressable>
                        </View>
                    </View>
                )}

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 16 }}>
                    <MyBalancesSection groupId={groupId} />

                    <GroupMembersSection
                        group={group}
                        isAdmin={isAdmin}
                    />

                    <View className='mt-5'>
                        <Text className="text-text text-lg font-semibold mb-5">
                            Expenses
                        </Text>

                        <View className="gap-1">
                            {expenses.length === 0 ? (
                                <Text className="text-textLight text-center py-6">
                                    No expenses yet
                                </Text>
                            ) : (
                                expenses.map(item => (
                                    <GroupExpenseItem key={item.id} item={item} />
                                ))
                            )}
                        </View>
                    </View>
                </ScrollView>

                <Pressable
                    onPress={openBottomSheet}
                    className="absolute bottom-12 right-8 bg-primary w-20 h-20 rounded-full items-center justify-center shadow-lg"
                >
                    <Ionicons name="add" size={32} color="white" />
                </Pressable>
            </View>
            <GroupActionSheet
                groupId={groupId}
                isAdmin={isAdmin}
                bottomSheetRef={bottomSheetRef}
                setLeaveGroupError={setLeaveGroupError}
                setDeleteGroupError={setDeleteGroupError}
            />
        </>
    );
}
