import { View, Text, TextInput, Image } from 'react-native';

type Props = {
    name: string;
    avatar?: string | null;
    value: number;
    editable: boolean;
    unit: '₹' | '%';
    isPayer: boolean;
    onChange: (v: number) => void;
};

export const SplitMemberRow = ({
    name,
    avatar,
    value,
    editable,
    unit,
    isPayer,
    onChange,
}: Props) => {
    return (
        <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
                <Image
                    source={avatar ? { uri: avatar } : require('@assets/images/logo.png')}
                    className="w-10 h-10 rounded-full"
                />
                <View>
                    <Text className="text-text font-medium">{name}</Text>
                    {isPayer && (
                        <Text className="text-xs text-primary font-semibold">Paid by</Text>
                    )}
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <Text className="text-textLight">{unit}</Text>

                <TextInput
                    editable={editable}
                    keyboardType="numeric"
                    value={value.toString()}
                    onChangeText={(t) => onChange(Number(t || 0))}
                    className="bg-background border border-border rounded-xl px-3 py-2 text-text w-20 text-right"
                />
            </View>
        </View>
    );
};
