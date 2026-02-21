import { StatPill } from "./StatPill";
import { EmptyState } from "./EmptyState";
import { MONTHS_SHORT } from "../constants";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { BarChart } from "react-native-gifted-charts";
import { SectionCard, SectionTitle } from "./Section";
import { formatCurrency } from "@/shared/utils/currency";
import { useMonthlySpending } from "../hooks/useInsights";
import { ActivityIndicator, ScrollView, View } from "react-native";

export const MonthlyChart = ({ year }: { year: number }) => {
    const { data, isLoading, isError } = useMonthlySpending(year);

    if (isLoading) return (
        <SectionCard>
            <SectionTitle title="Monthly Spending" subtitle={String(year)} />
            <ActivityIndicator color={COLORS.primary} style={{ height: 200 }} />
        </SectionCard>
    );

    if (isError || !data || !Array.isArray(data)) return (
        <SectionCard>
            <SectionTitle title="Monthly Spending" />
            <EmptyState message="Failed to load spending data" />
        </SectionCard>
    );

    const rows: { month: number; amount: number }[] = Array.isArray(data) ? data : [];

    const total = rows.reduce((s, d) => s + Number(d.amount), 0);
    const maxAmount = Math.max(...rows.map(d => Number(d.amount)), 1);
    const peak = rows?.reduce(
        (p: any, d) => (Number(d.amount) > Number(p?.amount ?? 0) ? d : p),
        null
    );

    const chartData = MONTHS_SHORT.map((label, i) => {
        const found = rows.find(r => r.month === i + 1);
        const value = found ? Math.round(Number(found.amount)) : 0;
        const isPeak = value === Math.round(maxAmount) && maxAmount > 0;
        return {
            value,
            label,
            frontColor: isPeak ? COLORS.primary : '#C4845A60',
            topLabelComponent: isPeak
                ? () => <Ionicons name='caret-up-outline' size={14} color={COLORS.primary} />
                : undefined,
        };
    });

    return (
        <SectionCard>
            <SectionTitle title="Monthly Spending" subtitle={`${year} overview`} />

            <View className='flex-row gap-2 mt-1 mb-6'>
                <StatPill
                    label="Total"
                    value={formatCurrency(total)}
                />
                <StatPill
                    label="Peak Month"
                    value={peak && maxAmount > 0 ? MONTHS_SHORT[peak.month - 1] : '—'}
                />
                <StatPill
                    label="Avg / Month"
                    value={formatCurrency(Math.round(total / rows.length))}
                />
            </View>

            {total === 0 ? (
                <EmptyState message="No expenses recorded for this year" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={chartData}
                        barWidth={20}
                        spacing={14}
                        roundedTop
                        // hideRules
                        xAxisColor={COLORS.border}
                        yAxisColor={'transparent'}
                        yAxisTextStyle={{ color: COLORS.textLight, fontSize: 10 }}
                        xAxisLabelTextStyle={{ color: COLORS.textLight, fontSize: 9 }}
                        noOfSections={4}
                        maxValue={Math.ceil(maxAmount * 1.2)}
                        height={180}
                        formatYLabel={(v: string) => {
                            const n = Number(v);
                            return n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);
                        }}
                        isAnimated
                        animationDuration={600}
                        backgroundColor={'transparent'}
                        yAxisThickness={0}
                    />
                </ScrollView>
            )}
        </SectionCard>
    );
}
