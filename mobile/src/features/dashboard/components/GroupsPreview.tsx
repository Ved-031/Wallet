import { router } from 'expo-router';
import { GroupPreviewCard } from './GroupPreviewCard';
import { useDashboardGroups } from '../hooks/useDashboardGroups';
import { Text, View, FlatList, Pressable, ActivityIndicator } from 'react-native';

export const GroupsPreview = () => {
    const { data, isLoading } = useDashboardGroups();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator />
                <Text className="mt-4 text-text">Loading groups...</Text>
            </View>
        );
    }

    if (!data || data.length === 0) return null;

    return (
        <View className="mt-6">
            <View className="flex-row items-center justify-between mb-3 px-1">
                <Text className="text-lg font-semibold text-text">Groups</Text>

                <Pressable onPress={() => router.push('/groups')}>
                    <Text className="text-textLight">View all</Text>
                </Pressable>
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={data.slice(0, 3).reverse()}
                keyExtractor={(item, index) => item.id ? String(item.id) : `group-${index}`}
                contentContainerStyle={{ paddingRight: 16 }}
                renderItem={({ item }) => (
                    <GroupPreviewCard
                        group={item}
                        onPress={() => router.push({
                            pathname: '/groups/[id]',
                            params: { id: item.id },
                        })}
                    />
                )}
            />
        </View>
    );
};
