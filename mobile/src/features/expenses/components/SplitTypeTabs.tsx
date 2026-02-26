import React from 'react';
import { SplitType } from '../types';
import { cn } from '@/shared/utils/cn';
import { View, Text, Pressable } from 'react-native';

type Props = {
    value: SplitType;
    onChange: (type: SplitType) => void;
};

const OPTIONS: SplitType[] = ['EQUAL', 'EXACT', 'PERCENT'];

export const SplitTypeTabs = ({ value, onChange }: Props) => {
    return (
        <View className="bg-card border border-border rounded-2xl flex-row">
            {OPTIONS.map(option => {
                const active = option === value;
                return (
                    <Pressable
                        key={option}
                        onPress={() => onChange(option)}
                        className={cn(
                            "flex-1 py-[10px] rounded-xl items-center justify-center",
                            active && "bg-primary"
                        )}
                    >
                        <Text
                            className={cn(
                                "text-sm font-semibold",
                                active ? "text-white" : "text-textLight"
                            )}
                        >
                            {option === 'EQUAL' && 'Equal'}
                            {option === 'EXACT' && 'Exact'}
                            {option === 'PERCENT' && 'Percent'}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};
