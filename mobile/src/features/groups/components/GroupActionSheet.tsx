import React from 'react';
import { router } from 'expo-router';
import { IoniconName } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { Pressable, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

type Props = {
    groupId: number;
    isAdmin: boolean;
    bottomSheetRef: React.RefObject<BottomSheet | null>;
}

type ActionItemProps = {
    icon: IoniconName;
    label: string;
    color?: string;
    onPress: () => void;
}

const ActionItem = ({ icon, label, color = COLORS.text, onPress }: ActionItemProps) => {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between py-1.5 rounded-2xl"
        >
            <View className="flex-row items-center gap-4">
                <View className="w-11 h-11 rounded-full bg-border/40 items-center justify-center border border-border">
                    <Ionicons
                        name={icon}
                        size={22}
                        color={color}
                    />
                </View>
                <Text className="text-text text-[16px] font-medium">
                    {label}
                </Text>
            </View>
            <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={COLORS.textLight}
            />
        </Pressable>
    );
}

const GroupActionSheet = ({ groupId, isAdmin, bottomSheetRef }: Props) => {
    const go = (path: any) => {
        bottomSheetRef.current?.close();
        router.push(path);
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['40%']}
            enablePanDownToClose
            backgroundStyle={{
                backgroundColor: COLORS.card,
                borderRadius: 35,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: COLORS.border,
            }}
        >
            <BottomSheetView style={{ flex: 1, paddingTop: 5, paddingHorizontal: 12, gap: 10 }}>
                <View className='bg-card rounded-t-3xl px-5 pt-6 pb-10'>
                    <View className='gap-3'>
                        <ActionItem
                            icon='receipt-outline'
                            label='Add Expense'
                            onPress={() => go(`/(app)/groups/${groupId}/add-expense`)}
                        />
                        <View className='h-[0.5px] bg-border' />
                        <ActionItem
                            icon='swap-horizontal-outline'
                            label='Settle Up'
                            onPress={() => go(`/(app)/groups/${groupId}/settle`)}
                        />
                        <View className='h-[0.5px] bg-border' />
                        <ActionItem
                            icon='person-add-outline'
                            label='Add Member'
                            onPress={() => go(`/(app)/groups/${groupId}/add-member`)}
                        />
                        <View className='h-[0.4px] bg-border' />
                        {isAdmin ? (
                            <ActionItem
                                icon='trash-outline'
                                label='Delete Group'
                                color={COLORS.expense}
                                onPress={() => go(`/(app)/groups/${groupId}/delete`)}
                            />
                        ) : (
                            <ActionItem
                                icon='exit-outline'
                                label='Leave Group'
                                color={COLORS.expense}
                                onPress={() => go(`/(app)/groups/${groupId}/leave`)}
                            />
                        )}
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheet>
    )
}

export default GroupActionSheet;
