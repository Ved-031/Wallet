import React, { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import EmptyState from '@/shared/components/EmptyState';
import { ActivityFilter } from '@/features/activity/types';
import { useActivity } from '@/features/activity/hooks/useActivity';
import { View, Text, SectionList, ActivityIndicator } from 'react-native';
import { mapActivityToUI } from '@/features/activity/utils/mapActivityToUI';
import { ActivityItem } from '@/features/dashboard/components/ActivityItem';
import { groupActivitiesByMonth } from '@/features/activity/utils/groupActivites';
import { ActivityFilterTabs } from '@/features/activity/components/ActivityFilter';

export default function ActivityScreen() {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useActivity();

    const [filter, setFilter] = React.useState<ActivityFilter>('ALL');

    const activities = useMemo(() => {
        if (!data) return [];

        const all = data.pages.flatMap((page: any) => page.data.map(mapActivityToUI));

        if (filter === 'ALL') return all;

        return all.filter(a => a.type === filter);
    }, [data, filter]);

    const sections = useMemo(
        () => groupActivitiesByMonth(activities),
        [activities]
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View className='flex-1 bg-background'>
            <View className='flex-row items-center justify-center gap-2 mt-10'>
                <Ionicons
                    name='stopwatch-outline'
                    size={24}
                    color={COLORS.text}
                />
                <Text className="text-text font-semibold text-3xl">All Activities {' '}</Text>
                <Text className="text-textLight text-2xl">({activities.length})</Text>
            </View>

            <View className='h-[1px] my-5 bg-border' />

            <View className="px-4 pt-2">
                <ActivityFilterTabs value={filter} onChange={setFilter} />
            </View>

            {activities.length === 0 && (
                <View className='flex-1 bg-background items-center justify-center'>
                    <EmptyState
                        icon="hourglass-outline"
                        title="No activity yet"
                        subtitle="Your expenses and settlements will appear here."
                    />
                </View>
            )}

            <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                stickySectionHeadersEnabled
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}

                renderItem={({ item }) => <ActivityItem item={item} />}

                renderSectionHeader={({ section: { title } }) => (
                    <View className="bg-background pt-6 pb-2">
                        <Text className="text-textLight text-sm font-semibold">
                            {title}
                        </Text>
                    </View>
                )}

                ItemSeparatorComponent={() => (
                    <View className="h-[0.5px] bg-border ml-14" />
                )}

                onEndReachedThreshold={0.4}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}

                ListFooterComponent={
                    isFetchingNextPage ? (
                        <View className="py-6">
                            <ActivityIndicator />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}
