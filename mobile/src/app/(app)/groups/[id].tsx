import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useLocalSearchParams, router } from 'expo-router';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { mapGroupExpenseToUI } from '@/features/groups/mapGroupExpense';
import { useGetGroupDetails } from '@/features/groups/hooks/useGetGroupDetails';
import { GroupExpenseItem } from '@/features/groups/components/GroupExpenseItem';
import { useGetGroupExpenses } from '@/features/groups/hooks/useGetGroupExpenses';
import { ActivityIndicator, View, Text, Pressable, Image, ScrollView } from 'react-native';

export default function GroupDetailsScreen() {
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
        <View className="flex-1 bg-background">
            {/* HEADER */}
            <View className="flex-row items-center justify-between px-5 pt-8 pb-6">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>

                <Text className="text-text text-2xl font-semibold">
                    {group.name}
                </Text>

                <Ionicons name="ellipsis-vertical" size={22} color={COLORS.text} />
            </View>

            <View className='border-b-[0.5px] border-border mb-6' />

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* SUMMARY CARD */}
                <View className="bg-card rounded-3xl p-6 mb-6 border border-border">
                    <Text className="text-textLight text-sm mb-2">
                        Group Summary
                    </Text>

                    <Text className="text-text text-2xl font-bold">
                        All settled
                    </Text>

                    {/* Later we will calculate actual balance */}
                </View>

                {/* MEMBERS */}
                <View className="mb-6">
                    <Text className="text-text text-lg font-semibold mb-4">
                        Members
                    </Text>

                    {group.members.map(member => (
                        <View
                            key={member.userId}
                            className="flex-row items-center justify-between mb-4"
                        >
                            <View className="flex-row items-center gap-3">
                                <Image
                                    source={{ uri: member.user.avatar }}
                                    className="w-10 h-10 rounded-full"
                                />

                                <View>
                                    <Text className="text-text font-medium">
                                        {member.user.name}
                                    </Text>
                                    <Text className="text-textLight text-sm">
                                        {member.role}
                                    </Text>
                                </View>
                            </View>

                            {isAdmin && member.role !== 'ADMIN' && (
                                <Ionicons
                                    name="trash-outline"
                                    size={18}
                                    color={COLORS.expense}
                                />
                            )}
                        </View>
                    ))}
                </View>

                {/* EXPENSES */}
                <View className="mt-4">
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

            {/* FAB */}
            <Pressable
                className="absolute bottom-8 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg"
            >
                <Ionicons name="add" size={28} color="white" />
            </Pressable>
        </View>
    );
}
