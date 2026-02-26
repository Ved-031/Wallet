import { cn } from '@/shared/utils/cn';
import { GroupPreview } from '../types';
import { formatCurrency } from '@/shared/utils/currency';
import { Text, Pressable, View, Image } from 'react-native';

type Props = {
    group: GroupPreview;
    onPress: () => void;
};

export const GroupPreviewCard = ({ group, onPress }: Props) => {
    const { name, balance, memberAvatars } = group;
    const positive = balance > 0;

    return (
        <Pressable
            onPress={onPress}
            className="bg-card rounded-2xl p-4 mr-3 w-[160px] shadow-sm border border-border"
        >
            {/* Avatar stack */}
            <View className="flex-row mb-3">
                {(memberAvatars ?? []).slice(0, 3).map((a, i) => (
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
                {balance === 0 ? 'All settled' : positive ? 'You owe' : 'You get'}
            </Text>

            <Text className={cn('font-bold text-lg mt-0.5', positive ? 'text-red-600' : 'text-green-600')}>
                {formatCurrency(Math.abs(balance))}
            </Text>
        </Pressable>
    );
};
