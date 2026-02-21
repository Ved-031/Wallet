import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { Text, TouchableOpacity, View } from "react-native";

interface YearSelectorProps {
    year: number;
    onChange: (y: number) => void;
}

export const YearSelector = ({ year, onChange }: YearSelectorProps) => {
    const currentYear = new Date().getFullYear();
    const atMax = year >= currentYear;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
                onPress={() => onChange(year - 1)}
                className='w-[30px] h-[30px] rounded-full bg-[#F5ECE6] items-center justify-center border border-border'
            >
                <Ionicons
                    name='chevron-back-outline'
                    color={COLORS.text}
                    size={15}
                />
            </TouchableOpacity>
            <View className='px-3 py-1.5 bg-[#F5ECE6] rounded-full border border-border'>
                <Text className='text-text text-[13px] font-semibold'>{year}</Text>
            </View>
            <TouchableOpacity
                onPress={() => !atMax && onChange(year + 1)}
                className='w-[30px] h-[30px] rounded-full bg-[#F5ECE6] items-center justify-center border border-border'
                disabled={atMax}
            >
                <Ionicons
                    name='chevron-forward-outline'
                    color={COLORS.text}
                    size={15}
                />
            </TouchableOpacity>
        </View>
    );
}
