import React from 'react';
import { Group } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native';
import { COLORS } from '@/shared/constants/colors';

interface Props {
    group: Group;
    isAdmin: boolean;
}

const GroupMemberItem = ({ member, isAdmin }: { member: Group['members'][0], isAdmin: boolean }) => {
    return (
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
                        {member.role === 'ADMIN' ? 'Admin' : 'Member'}
                    </Text>
                </View>
            </View>

            {isAdmin && (
                <Ionicons
                    name="person-remove-outline"
                    size={18}
                    color={COLORS.expense}
                />
            )}
        </View>
    );
}

const GroupMembersSection = ({ group, isAdmin }: Props) => {
    return (
        <View>
            <Text className="text-text text-lg font-semibold mb-4">
                Members
            </Text>

            {group.members.map(member => (
                <GroupMemberItem
                    key={member.userId}
                    member={member}
                    isAdmin={isAdmin}
                />
            ))}
        </View>
    )
}

export default GroupMembersSection
