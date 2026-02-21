import { Text, View } from "react-native";

interface StatPillProps {
    label: string;
    value: string;
}

export const StatPill = ({ label, value }: StatPillProps) => {
    return (
        <View className='flex-1 bg-[#F5ECE6] rounded-[12px] p-[10px] border border-border'>
            <Text className='text-text text-[11px] font-regular'>{label}</Text>
            <Text className='text-text text-[14px] font-semibold mt-[3px]'>
                {value}
            </Text>
        </View>
    );
}
