import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { COLORS } from '@/shared/constants/colors';
import NoGroupFound from '@/features/groups/components/NoGroup';
import { GroupCard } from '@/features/groups/components/GroupCard';
import { CreateGroupSheet } from '@/features/groups/components/CreateGroupSheet';
import { useGetGroupsPreview } from '@/features/groups/hooks/useGetGroupsPreview';
import { View, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';

const GroupsScreen = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { data, isLoading } = useGetGroupsPreview();

    const openBottomSheet = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    useFocusEffect(
        useCallback(() => {
            return () => {
                bottomSheetRef.current?.close();
            };
        }, [])
    );

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
                        onPress={openBottomSheet}
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

                {/* GROUP LIST */}
                <FlatList
                    data={data}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <GroupCard group={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <CreateGroupSheet bottomSheetRef={bottomSheetRef} />
        </>
    );
}

export default GroupsScreen;
