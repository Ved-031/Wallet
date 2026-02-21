import { cn } from "@/shared/utils/cn";
import { MONTHS_SHORT } from "../constants";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export const MonthSelector = ({ month, onChange }: { month: number; onChange: (m: number) => void }) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 8, gap: 6, flexDirection: 'row' }}
        >
            {MONTHS_SHORT.map((label, i) => {
                const m = i + 1;
                const selected = month === m;
                return (
                    <TouchableOpacity
                        key={m}
                        onPress={() => onChange(m)}
                        className={cn(
                            'px-[14px] py-[7px] rounded-full border',
                            selected ? 'bg-primary border-primary' : 'bg-[#F5ECE6] border-border',
                        )}
                    >
                        <Text
                            className={cn(
                                'text-[13px]',
                                selected ? 'text-white font-semibold' : 'text-textLight font-regular'
                            )}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}
