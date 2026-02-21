import { cn } from "@/shared/utils/cn";
import { EmptyState } from "./EmptyState";
import { useEffect, useState } from "react";
import { COLORS } from "@/shared/constants/colors";
import { PieChart } from "react-native-gifted-charts";
import { SectionCard, SectionTitle } from "./Section";
import { useCategoryBreakdown } from "../hooks/useInsights";
import { CATEGORY_COLORS, MONTHS_SHORT } from "../constants";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export const CategoryChart = ({ month, year }: { month: number; year: number }) => {
    const { data, isLoading, isError } = useCategoryBreakdown(month, year);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    useEffect(() => {
        setActiveIndex(null);
    }, [month, year]);

    if (isLoading) return (
        <SectionCard>
            <SectionTitle title="Category Breakdown" subtitle={`${MONTHS_SHORT[month - 1]} ${year}`} />
            <ActivityIndicator color={COLORS.primary} style={{ height: 200 }} />
        </SectionCard>
    );

    if (isError || !data || !Array.isArray(data)) return (
        <SectionCard>
            <SectionTitle title="Category Breakdown" />
            <EmptyState message="Failed to load category data" />
        </SectionCard>
    );

    const rows: { category: string; amount: number }[] = Array.isArray(data) ? data : [];

    if (rows.length === 0) return (
        <SectionCard>
            <SectionTitle title="Category Breakdown" subtitle={`${MONTHS_SHORT[month - 1]} ${year}`} />
            <EmptyState message={`No expenses in ${MONTHS_SHORT[month - 1]} ${year}`} />
        </SectionCard>
    );

    const total = rows?.reduce((s, d) => s + Number(d.amount), 0);

    const pieData = rows?.map((d, i) => ({
        value: Math.round(Number(d.amount)),
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        label: d.category,
        pct: `${((Number(d.amount) / total) * 100).toFixed(1)}%`,
        focused: activeIndex === i,
    }));

    const active = activeIndex !== null ? pieData[activeIndex] : null;

    return (
        <SectionCard>
            <SectionTitle
                title="Category Breakdown"
                subtitle={`${MONTHS_SHORT[month - 1]} ${year}`}
            />

            <View className='items-center mb-0'>
                <PieChart
                    data={pieData}
                    donut
                    innerRadius={70}
                    radius={110}
                    focusOnPress
                    onPress={(item: any, index: number) => {
                        setActiveIndex(index === activeIndex ? null : index);
                    }}
                    centerLabelComponent={() => (
                        <View className='items-center px-2'>
                            {active ? (
                                <>
                                    <Text
                                        className='text-textLight text-[10px] text-center'
                                        numberOfLines={2}
                                    >
                                        {active.label}
                                    </Text>
                                    <Text className='text-text text-[16px] font-bold mt-[2px]'>
                                        ₹{active.value.toLocaleString('en-IN')}
                                    </Text>
                                    <Text className={cn('text-[12px] font-semibold', active.color)}>
                                        {active.pct}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className='text-textLight text-[11px]'>Total</Text>
                                    <Text className='text-text text-lg font-bold mt-[2px]'>
                                        ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </Text>
                                    <Text className='text-textLight text-[10px] mt-[1px]'>
                                        {rows.length} categories
                                    </Text>
                                </>
                            )}
                        </View>
                    )}
                    isAnimated
                    animationDuration={600}
                />
            </View>

            <View className='h-[0.5px] bg-border my-3 -mx-4' />

            {/* Legend */}
            <View className='gap-y-[2px]'>
                {pieData.map((d, i) => {
                    const isActive = activeIndex === i;
                    const barWidth = (d.value / total) * 100;
                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setActiveIndex(i === activeIndex ? null : i)}
                            activeOpacity={0.7}
                            className={cn(
                                'p-[10px] rounded-xl border border-border',
                                isActive ? 'border-1 bg-[#F5ECE6]' : 'border-0 bg-transparent'
                            )}
                        >
                            <View className='flex-row items-center gap-[10px]'>
                                <Text
                                    className={cn(
                                        'flex-1 text-text text-[12px]',
                                        isActive ? 'font-semibold' : 'font-normal'
                                    )}
                                >
                                    {d.label}
                                </Text>
                                <Text className='text-textLight text-[13px]'>
                                    ₹{d.value.toLocaleString('en-IN')}
                                </Text>
                                <Text
                                    className={cn(
                                        'text-sm font-semibold text-right',
                                        d.color,
                                    )}
                                >
                                    {d.pct}
                                </Text>
                            </View>
                            <View className='bg-border w-full h-[3px] mt-2 rounded-[2px]'>
                                <View
                                    style={{
                                        width: `${barWidth}%`, height: 3, borderRadius: 2,
                                        backgroundColor: d.color,
                                        opacity: isActive ? 1 : 0.45,
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SectionCard>
    );
}
