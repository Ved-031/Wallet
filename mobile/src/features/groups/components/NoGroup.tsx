import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import CreateGroupModal from './CreateGroupModal';
import { COLORS } from '@/shared/constants/colors';
import { View, Text, TouchableOpacity } from 'react-native';

const NoGroupFound = () => {
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    return (
        <>
            <View className='bg-card rounded-2xl p-[30px] items-center justify-center shadow shadow-shadow'>
                <Ionicons
                    name="people-outline"
                    size={60}
                    color={COLORS.textLight}
                    className='mt-4'
                />
                <Text className='text-lg font-semibold text-text mb-1 mt-2'>No groups yet</Text>
                <Text className='text-textLight text-[14px] text-center mb-5 leading-5'>
                    Start tracking you finances with your firends
                </Text>
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
                        Add Group
                    </Text>
                </TouchableOpacity>
            </View>
            <CreateGroupModal
                visible={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
            />
        </>
    );
};

export default NoGroupFound;
