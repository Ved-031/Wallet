import { useState } from 'react';
import { cn } from '@/shared/utils/cn';
import { User } from '@/features/auth/types';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/shared/utils/currency';
import { View, Text, Pressable, Image } from 'react-native';
import SettleUpModal from '@/features/settlements/components/SettleUpModal';

type Settlement = {
    from: { userId: number; name: string; avatar: string };
    to: { userId: number; name: string; avatar: string };
    amount: number;
};

type Props = {
    me: User;
    groupId: number;
    settlement: Settlement;
};

export const BalanceRow = ({ me, groupId, settlement }: Props) => {
    const iOwe = settlement.from.userId === me.id;
    const otherPerson = iOwe ? settlement.to : settlement.from;

    const [showSettle, setShowSettle] = useState(false);

    return (
        <>
            <View
                className={cn(
                    "flex-row items-center justify-between px-4 py-4 rounded-2xl border",
                    iOwe ? "bg-red-100/40 border-red-100" : "bg-green-100/40 border-green-100"
                )}
            >
                <View className="flex-row items-center gap-3">
                    <Image
                        source={{ uri: otherPerson.avatar }}
                        className="w-10 h-10 rounded-full"
                    />

                    <View>
                        <Text className="text-text font-medium">
                            {iOwe
                                ? `You owe ${otherPerson.name}`
                                : `${otherPerson.name} owes you`}
                        </Text>

                        <Text
                            className={cn(
                                "text-sm mt-1 font-semibold",
                                iOwe ? "text-red-600" : "text-green-600"
                            )}
                        >
                            {formatCurrency(settlement.amount)}
                        </Text>
                    </View>
                </View>

                {iOwe && (
                    <Pressable
                        onPress={() => setShowSettle(true)}
                        className="bg-primary px-4 py-2 rounded-xl flex-row items-center gap-1"
                    >
                        <Ionicons
                            name="arrow-up-outline"
                            size={16}
                            color="white"
                        />
                        <Text className="text-white font-medium">
                            Settle
                        </Text>
                    </Pressable>
                )}
            </View>
            <SettleUpModal
                visible={showSettle}
                onClose={() => setShowSettle(false)}
                groupId={groupId}
                userId={otherPerson.userId}
                userName={otherPerson.name}
                amount={settlement.amount}
            />
        </>
    );
};
