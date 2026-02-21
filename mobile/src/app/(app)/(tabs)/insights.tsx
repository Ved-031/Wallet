import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YearSelector } from '@/features/analytics/components/YearSelector';
import { MonthlyChart } from '@/features/analytics/components/MonthlyChart';
import { MonthSelector } from '@/features/analytics/components/MonthSelector';
import { CategoryChart } from '@/features/analytics/components/CategoryChart';

export default function InsightsScreen() {
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth() + 1);

    return (
        <SafeAreaView className='flex-1 bg-background' edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 10 }}
            >
                <View className='flex-row items-center justify-between stroke-border px-4 mb-10'>
                    <View>
                        <Text className='text-text text-3xl font-bold'>
                            Insights
                        </Text>
                        <Text className='text-textLight text-[13px] mt-[2px]'>
                            Your spending patterns
                        </Text>
                    </View>
                    <YearSelector year={year} onChange={setYear} />
                </View>

                <MonthlyChart year={year} />

                <View className='px-4 mt-6 mb-3'>
                    <Text className='text-textLight text-[11px] font-semibold tracking-[0.8px] mb-[10px]'>
                        SELECT MONTH
                    </Text>
                    <MonthSelector month={month} onChange={setMonth} />
                </View>

                <View className='my-2'>
                    <CategoryChart month={month} year={year} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
