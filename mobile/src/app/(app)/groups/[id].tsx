import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useLocalSearchParams } from 'expo-router';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { mapGroupExpenseToUI } from '@/features/groups/mapGroupExpense';
import { GroupHeader } from '@/features/groups/components/GroupHeader';
import { useGetGroupDetails } from '@/features/groups/hooks/useGetGroupDetails';
import { GroupExpenseItem } from '@/features/groups/components/GroupExpenseItem';
import { useGetGroupExpenses } from '@/features/groups/hooks/useGetGroupExpenses';
import { MyBalancesSection } from '@/features/groups/components/MyBalancesSection';
import GroupMembersSection from '@/features/groups/components/GroupMembersSection';
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
            <GroupHeader
                name={group.name}
                isAdmin={isAdmin}
                onLeave={() => {}}
                onDelete={() => {}}
            />

            <View className='border-b-[0.5px] border-border mb-6' />

            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, gap: 16 }}>
                <MyBalancesSection groupId={groupId} />

                <View className='border-b-[0.5px] border-border' />

                <GroupMembersSection
                    group={group}
                    isAdmin={isAdmin}
                />

                <View className='border-b-[0.5px] border-border' />

                <View>
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
                className="absolute bottom-12 right-8 bg-primary w-20 h-20 rounded-full items-center justify-center shadow-lg"
            >
                <Ionicons name="add" size={32} color="white" />
            </Pressable>
        </View>
    );
}
