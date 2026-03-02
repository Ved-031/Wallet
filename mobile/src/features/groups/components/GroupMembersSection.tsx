import React from 'react';
import { Group } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useRemoveMember } from '../hooks/useRemoveMember';
import { getErrorMessage } from '@/shared/utils/getErrorMsg';
import { useGroupInvites } from '@/features/invites/hooks/useGroupInvites';
import PendingInviteRow from '@/features/invites/components/PendingInviteRow';
import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native';

interface Props {
    group: Group;
    isAdmin: boolean;
}

interface GroupMemberItemProps {
    member: Group['members'][0];
    isAdmin: boolean;
    setRemoveErrorMsg: (msg: string) => void
}

const GroupMemberItem = ({ member, isAdmin, setRemoveErrorMsg }: GroupMemberItemProps) => {
    const { mutate, isPending, variables } = useRemoveMember(member.groupId);

    const removingThisUser = isPending && variables?.userId === member.userId;

    const handleRemoveMember = () => {
        mutate({
            groupId: member.groupId,
            userId: member.userId,
        }, {
            onSuccess: () => {
                setRemoveErrorMsg('');
            },
            onError: (error) => {
                setRemoveErrorMsg(getErrorMessage(error));
            },
        });
    }

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

            {isAdmin && member.role !== 'ADMIN' && (
                removingThisUser ? (
                    <ActivityIndicator size={'small'} color={COLORS.primary} />
                ) : (
                    <Pressable
                        onPress={handleRemoveMember}
                    >
                        <Ionicons
                            name="person-remove-outline"
                            size={18}
                            color={COLORS.expense}
                        />
                    </Pressable>
                )
            )}
        </View>
    );
}

const GroupMembersSection = ({ group, isAdmin }: Props) => {
    const { data: invites } = useGroupInvites(group.id);
    const [removeErrorMsg, setRemoveErrorMsg] = React.useState('');

    return (
        <View className='bg-card p-4 rounded-2xl border border-border'>
            <Text className="text-text text-lg font-semibold mb-4">
                Members
            </Text>

            {/* ACTIVE MEMBERS */}
            {group.members.map(member => (
                <GroupMemberItem
                    key={member.userId}
                    member={member}
                    isAdmin={isAdmin}
                    setRemoveErrorMsg={setRemoveErrorMsg}
                />
            ))}

            {!!removeErrorMsg && (
                <View className='flex-row items-center justify-between bg-expense/10 px-4 rounded-lg'>
                    <View className='flex-row items-center gap-1'>
                        <Ionicons
                            name='alert-circle-outline'
                            size={16}
                            color={COLORS.expense}
                        />
                        <Text className='text-expense my-2 font-medium'>
                            {removeErrorMsg}
                        </Text>
                    </View>
                    <Pressable onPress={() => setRemoveErrorMsg('')}>
                        <Ionicons
                            name='close'
                            size={16}
                            color={COLORS.expense}
                        />
                    </Pressable>
                </View>
            )}

            {/* PENDING MEMBERS */}
            {invites?.length > 0 && (
                <>
                    <View className='h-[0.5px] bg-border mb-4 mt-2' />
                    <Text className='text-text font-medium mb-2'>
                        Invited
                    </Text>
                    {invites?.map((invite: any) => (
                        <PendingInviteRow
                            key={invite.id}
                            invite={invite}
                        />
                    ))}
                </>
            )}
        </View>
    )
}

export default GroupMembersSection
