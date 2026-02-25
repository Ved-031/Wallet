import { useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS } from '@/shared/constants/colors';
import { View, Text, TouchableOpacity } from 'react-native';
import { CreateGroupSheet } from './CreateGroupSheet';

const NoGroupFound = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const openBottomSheet = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

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
                    // onPress={() => router.push('/gropus/create')}
                    onPress={openBottomSheet}
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
            <CreateGroupSheet bottomSheetRef={bottomSheetRef} />
        </>
    );
};

export default NoGroupFound;
