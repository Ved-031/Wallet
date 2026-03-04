import { useState } from "react";
import { router } from "expo-router";
import { IoniconName } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { Pressable, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CreateGroupModal from "@/features/groups/components/CreateGroupModal";

type Props = {
    ref: React.RefObject<BottomSheet | null>;
}

type SheetItem = {
    icon: IoniconName;
    label: string;
    description?: string;
    color?: string;
    onPress?: () => void;
}

const SheetItem = ({ icon, label, description, color, onPress }: SheetItem) => {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-between px-3 py-1.5 rounded-2xl"
        >
            <View className="flex-row items-center gap-4">
                <View className="w-11 h-11 rounded-full bg-border/40 items-center justify-center border border-border">
                    <Ionicons
                        name={icon}
                        size={22}
                        color={color || "#4A3428"}
                    />
                </View>
                <View>
                    <Text className="text-text text-[16px] font-medium">
                        {label}
                    </Text>
                    {description && (
                        <Text className="text-textLight text-[12px]">
                            {description}
                        </Text>
                    )}
                </View>
            </View>
            <Ionicons
                name="chevron-forward-outline"
                size={20}
                color={COLORS.textLight}
            />
        </Pressable>
    )
}

export const AddButtonSheet = ({ ref }: Props) => {
    const [showCreateGroup, setShowCreateGroup] = useState(false);

    const handlePress = (href?: any) => {
        ref.current?.close();
        router.push(href);
    }

    return (
        <>
            <BottomSheet
                ref={ref}
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
                <BottomSheetView style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20, gap: 10 }}>
                    <SheetItem
                        label="Add transaction"
                        description="Quickly add new personal transaction"
                        icon="receipt-outline"
                        onPress={() => handlePress('/transactions/create')}
                    />
                    <View className="h-[0.4px] bg-border" />
                    <SheetItem
                        label="Create group"
                        description="Group with your friends"
                        icon="people-outline"
                        onPress={() => {
                            setShowCreateGroup(true);
                            ref.current?.close();
                        }}
                    />
                    <View className="h-[0.4px] bg-border" />
                    <SheetItem
                        label="Transfer to group"
                        description="Share expenses with your friends"
                        icon="share-outline"
                        onPress={() => handlePress('/(tabs)/groups')}
                    />
                    <View className="h-[0.4px] bg-border" />
                    <SheetItem
                        label="Transaction history"
                        description="See your transaction history"
                        icon="time-outline"
                        onPress={() => handlePress('/activity')}
                    />
                </BottomSheetView>
            </BottomSheet>
            <CreateGroupModal
                visible={showCreateGroup}
                onClose={() => setShowCreateGroup(false)}
            />
        </>
    )
};
