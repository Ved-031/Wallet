import React from 'react'
import { useQueryClient } from '@tanstack/react-query';
import BalanceCard from '@/features/dashboard/components/BalanceCard';
import { DashboardHeader } from '@/features/dashboard/components/Header';
import { QuickActions } from '@/features/dashboard/components/QuickActions';
import { GroupsPreview } from '@/features/dashboard/components/GroupsPreview';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import { useDashboardSummary } from '@/features/dashboard/api/useDashboardSummary';
import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import BalanceCardSkeleton from '@/features/dashboard/components/skeleton/BalanceCardSkeleton';

const HomeScreen = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, error, isFetching } = useDashboardSummary();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
            queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] }),
        ]);
        setRefreshing(false);
    }

    if (isLoading) {
        return (
            <View className='flex-1 items-center justify-center bg-background'>
                <ActivityIndicator color="#9A8478" />
                <Text className='mt-4 text-text'>
                    Loading dashboard...
                </Text>
            </View>
        );
    }

    if (error) {
        console.log(error);
        return (
            <View className='flex-1 items-center justify-center bg-background'>
                <Text className='text-expense font-semibold'>
                    Fialed to load dashboard: {error.name}
                </Text>
                <Text className="text-muted mt-2">
                    {(error as Error).message}
                </Text>
            </View>
        );
    }

    if (!data) {
        return (
            <View className='flex-1 items-center justify-center bg-background'>
                <Text className='text-expense font-semibold'>
                    No dashboard data
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            className='bg-background flex-1'
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing || isFetching} onRefresh={onRefresh} />}
        >
            <View className='p-5 pb-0'>
                <DashboardHeader />
                {isLoading ? (
                    <BalanceCardSkeleton />
                ) : (
                    <BalanceCard
                        summary={{
                            netBalance: data.netBalance,
                            youOwe: data.youOwe,
                            youAreOwed: data.youAreOwed,
                            personalBalance: data.personalBalance,
                            activeGroups: data.activeGroups
                        }}
                    />
                )}
                <QuickActions />
                <RecentActivity />
                <GroupsPreview />
            </View>
        </ScrollView>
    );
}

export default HomeScreen
