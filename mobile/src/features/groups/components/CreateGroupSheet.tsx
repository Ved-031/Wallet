import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useCreateGroup } from '@/features/groups/hooks/useCreateGroup';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';

type Props = {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
}

export const CreateGroupSheet = ({ bottomSheetRef }: Props) => {
    const [name, setName] = useState('');
    const createGroup = useCreateGroup();

    const handleBlur = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleCreate = async () => {
        if (!name.trim()) return;
        await createGroup.mutateAsync(name.trim());
        bottomSheetRef.current?.close();
        setName('');
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={['40%', '75%']}
            enablePanDownToClose
            keyboardBehavior='interactive'
            keyboardBlurBehavior='none'
            backgroundStyle={{
                backgroundColor: COLORS.card,
                borderRadius: 35,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: COLORS.border,
            }}
            handleIndicatorStyle={{
                backgroundColor: COLORS.border,
                width: 40,
            }}
        >
            <BottomSheetView style={{ flex: 1, paddingTop: 20, paddingHorizontal: 20, gap: 10 }}>
                <View className="bg-card rounded-t-3xl px-5 pt-6 pb-10">
                    {/* TITLE */}
                    <View className="flex-row items-center justify-center gap-3 mb-8">
                        <Ionicons name="people-outline" size={28} color={COLORS.text} />
                        <Text className="text-text text-2xl font-semibold">
                            Create Group
                        </Text>
                    </View>

                    {/* INPUT */}
                    <BottomSheetTextInput
                        value={name}
                        onChangeText={setName}
                        onBlur={handleBlur}
                        placeholder="Trip to Goa"
                        placeholderTextColor={COLORS.textLight}
                        className="bg-background/10 border border-border rounded-2xl px-4 py-4 text-text text-lg"
                    />

                    {/* BUTTON */}
                    <Pressable
                        onPress={handleCreate}
                        disabled={!name.trim() || createGroup.isPending}
                        className="bg-primary mt-6 py-4 rounded-2xl items-center"
                    >
                        {createGroup.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">
                                Create
                            </Text>
                        )}
                    </Pressable>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};
