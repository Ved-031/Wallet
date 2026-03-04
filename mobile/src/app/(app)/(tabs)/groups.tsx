import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { InviteRaw } from '@/features/invites/types';
import NoGroupFound from '@/features/groups/components/NoGroup';
import { mapInviteToUI } from '@/features/invites/mapInviteToUi';
import { useInvites } from '@/features/invites/hooks/useInvites';
import { GroupCard } from '@/features/groups/components/GroupCard';
import { InviteCard } from '@/features/invites/components/InviteCard';
import CreateGroupModal from '@/features/groups/components/CreateGroupModal';
import { useGetGroupsPreview } from '@/features/groups/hooks/useGetGroupsPreview';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';

const GroupsScreen = () => {
    const { data: rawInvites } = useInvites();
    const { data, isLoading } = useGetGroupsPreview();

    const [showCreateGroup, setShowCreateGroup] = React.useState(false);

    const invites = rawInvites?.map((inv: InviteRaw) => mapInviteToUI(inv));

    if (isLoading) {
        return (
            <View className='flex-1 bg-background items-center justify-center'>
                <ActivityIndicator size={'small'} color={COLORS.primary} />
            </View>
        );
    }

    if (!data || data.length === 0) {
        return (
            <View className='flex-1 bg-background items-center justify-center'>
                <NoGroupFound />
            </View>
        );
    }

    return (
        <>
            <View className='flex-1 bg-background px-5 pt-10'>
                {/* HEADER */}
                <View className='flex-row items-center justify-between px-2 mb-10'>
                    <View>
                        <Text className='text-text text-3xl font-semibold'>
                            Groups
                        </Text>
                        <Text className='text-textLight text-[14px]'>
                            Your grouped expenses
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowCreateGroup(true)}
                        className='flex-row items-center gap-2 bg-primary rounded-full px-4 py-[10px] shadow shadow-shadow mt-1'
                    >
                        <Ionicons
                            name="add-circle"
                            size={18}
                            color={COLORS.white}
                        />
                        <Text className='text-white font-semibold'>
                            Create
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* GROUP INVITES */}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {invites?.length > 0 && (
                                <View className="mb-6">
                                    <Text className="text-text text-lg font-semibold mb-3">
                                        Pending Invites
                                    </Text>

                                    {invites.map((invite: any) => (
                                        <InviteCard key={invite.id} invite={invite} />
                                    ))}
                                </View>
                            )}
                        </>
                    }
                    data={data}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <GroupCard group={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <CreateGroupModal
                onClose={() => setShowCreateGroup(false)}
                visible={showCreateGroup}
            />
        </>
    );
}

export default GroupsScreen;
