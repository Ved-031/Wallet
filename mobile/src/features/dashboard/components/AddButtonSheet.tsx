import { router } from "expo-router";
import { IoniconName } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { Pressable, Text, View } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

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
    const handlePress = (href?: any) => {
        ref.current?.close();
        router.push(href);
    }

    return (
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
                    label="Split bill"
                    description="Split your bill with friends"
                    icon="person-add-outline"
                    onPress={() => handlePress('/groups/create-expense')}
                />
                <View className="h-[0.5px] bg-border" />
                <SheetItem
                    label="Create group"
                    description="Group with your friends"
                    icon="people-outline"
                    onPress={() => handlePress('/groups/create')}
                />
                <View className="h-[0.4px] bg-border" />
                <SheetItem
                    label="Settle up"
                    description="Pay your debts"
                    icon="swap-horizontal-outline"
                    onPress={() => handlePress('/settlements/create')}
                />
            </BottomSheetView>
        </BottomSheet>
    )
};
