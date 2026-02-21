import { formatCurrency } from '@/shared/utils/currency';
import { Text, Pressable, View, Image } from 'react-native';

type Props = {
    name: string;
    balance: number;
    avatars: string[];
    onPress: () => void;
};

export const GroupPreviewCard = ({ name, balance, avatars, onPress }: Props) => {
    const positive = balance >= 0;

    return (
        <Pressable
            onPress={onPress}
            className="bg-card rounded-2xl p-4 mr-3 w-[160px] shadow-sm"
        >
            {/* Avatar stack */}
            <View className="flex-row mb-3">
                {avatars.slice(0, 3).map((a, i) => (
                    <Image
                        key={i}
                        source={{ uri: a }}
                        className={`w-8 h-8 rounded-full border-2 border-background ${i !== 0 ? '-ml-2' : ''
                            }`}
                    />
                ))}
            </View>

            {/* Name */}
            <Text numberOfLines={1} className="text-text font-semibold">
                {name}
            </Text>

            {/* Balance */}
            <Text className="text-textLight text-sm mt-1">
                {positive ? 'You get' : 'You owe'}
            </Text>

            <Text className="text-text font-bold text-lg mt-0.5">
                {formatCurrency(Math.abs(balance))}
            </Text>
        </Pressable>
    );
};
