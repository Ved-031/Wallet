import { useCallback, useState } from "react";
import { COLORS } from "@/shared/constants/colors";
import { useSendInvite } from "../hooks/useSendInvite";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";

type Props = {
    groupId: number;
    bottomSheetRef: React.RefObject<BottomSheet | null>;
};

export default function InviteMemberSheet({ groupId, bottomSheetRef }: Props) {
    const [email, setEmail] = useState("");
    const inviteMutation = useSendInvite(groupId);

    const handleBlur = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const handleSend = async () => {
        if (!email.trim()) return;

        await inviteMutation.mutateAsync(email.trim());
        setEmail("");
        bottomSheetRef.current?.close();
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
            <BottomSheetView style={{ flex: 1, paddingHorizontal: 12, gap: 10 }}>
                <View className="px-6 pt-10 gap-5">
                    <Text className="text-text text-2xl font-semibold text-center mb-5">
                        Invite Member
                    </Text>

                    <TextInput
                        value={email}
                        onChangeText={setEmail}
                        onBlur={handleBlur}
                        placeholder="Enter email address"
                        placeholderTextColor={COLORS.textLight}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="border border-border rounded-2xl px-4 py-4 text-text"
                    />

                    <Pressable
                        onPress={handleSend}
                        disabled={inviteMutation.isPending}
                        className="bg-primary py-4 rounded-2xl items-center"
                    >
                        {inviteMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-semibold text-lg">
                                Send Invite
                            </Text>
                        )}
                    </Pressable>
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
}
