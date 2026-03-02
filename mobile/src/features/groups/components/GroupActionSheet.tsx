import React, { useRef } from 'react';
import { router } from 'expo-router';
import { cn } from '@/shared/utils/cn';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { Pressable, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import InviteMemberSheet from '@/features/invites/components/InviteMemberSheet';

type Props = {
    groupId: number;
    isAdmin: boolean;
    bottomSheetRef: React.RefObject<BottomSheet | null>;
}

type SheetActionItemProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    danger?: boolean;
    onPress: () => void;
};

const SheetActionItem = ({ icon, label, danger, onPress }: SheetActionItemProps) => {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center gap-4 py-2 px-2 active:opacity-60"
        >
            <Ionicons
                name={icon}
                size={20}
                color={danger ? "#ef4444" : "#374151"}
            />

            <Text
                className={cn(
                    "text-base font-medium",
                    danger ? "text-red-500" : "text-text"
                )}
            >
                {label}
            </Text>
        </Pressable>
    );
};

const SheetSection = ({ title }: { title: string }) => {
    return (
        <View className="pt-5 pb-2">
            <Text className="text-textLight text-xs uppercase tracking-wider">
                {title}
            </Text>
        </View>
    );
};

const GroupActionSheet = ({ groupId, isAdmin, bottomSheetRef }: Props) => {
    const inviteSheetRef = useRef<BottomSheet>(null);

    const go = (path: any) => {
        bottomSheetRef.current?.close();
        router.push(path);
    }

    return (
        <>
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
                <BottomSheetView style={{ flex: 1, paddingHorizontal: 12, gap: 10 }}>
                    <View className='bg-card rounded-t-3xl px-5 pt-2 pb-10'>
                        <View className='gap-3'>
                            {/* MAIN ACTIONS */}
                            <SheetSection title='Actions' />
                            <SheetActionItem
                                icon='receipt-outline'
                                label='Add Expense'
                                onPress={() => go(`/(app)/groups/${groupId}/add-expense`)}
                            />
                            <SheetActionItem
                                icon='person-add-outline'
                                label='Add Member'
                                onPress={() => {
                                    bottomSheetRef.current?.close();
                                    setTimeout(() => {
                                        inviteSheetRef.current?.expand();
                                    }, 250);
                                }}
                            />

                            {/* MANAGEMENT */}
                            <SheetSection title='Manager' />
                            <SheetActionItem
                                icon='create-outline'
                                label='Rename group'
                                onPress={() => { }}
                            />
                            <SheetActionItem
                                icon='time-outline'
                                label='Settlement History'
                                onPress={() => { }}
                            />

                            {/* DANGER ZONE */}
                            <SheetSection title='Danger zone' />
                            {isAdmin ? (
                                <SheetActionItem
                                    icon='trash-outline'
                                    label='Delete Group'
                                    danger
                                    onPress={() => { }}
                                />
                            ) : (
                                <SheetActionItem
                                    icon='exit-outline'
                                    label='Leave group'
                                    danger
                                    onPress={() => { }}
                                />
                            )}
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheet>
            <InviteMemberSheet
                groupId={groupId}
                bottomSheetRef={inviteSheetRef}
            />
        </>
    )
}

export default GroupActionSheet;
