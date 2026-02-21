import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '@/shared/utils/currency';
import AnimatedCurrency from '@/shared/components/AnimatedCurrency';

type Summary = {
    netBalance: number;
    youOwe: number;
    youAreOwed: number;
    personalBalance: number;
    activeGroups: number;
};

export default function BalanceCard({ summary }: { summary: Summary }) {
    const positive = summary.netBalance >= 0;

    return (
        <View className="bg-card rounded-3xl p-5 shadow-md">

            {/* TITLE */}
            <Text className="text-textLight font-medium">Total Balance</Text>

            {/* MAIN BALANCE */}
            <View className="mt-2">
                <AnimatedCurrency
                    value={summary.netBalance}
                    className='text-5xl mt-1 font-semibold text-text'
                />
            </View>

            {/* STATUS */}
            <View className="mt-1.5 gap-x-1 flex-row items-center">
                {positive
                    ? <Ionicons name='arrow-up-outline' size={14} color="#2ECC71" />
                    : <Ionicons name='arrow-down-outline' size={14} color="#E74C3C" />
                }
                <Text>
                    {positive ? 'You are owed' : 'You owe'} {" "}
                    {positive ? formatCurrency(summary.youAreOwed) : formatCurrency(summary.youOwe)}
                </Text>
            </View>

            {/* DIVIDER */}
            <View className="h-[0.5px] bg-border my-5" />

            {/* STATS GRID */}
            <View className="flex-row justify-between px-3">
                {/* YOU OWE */}
                <View className='flex flex-col items-center justify-center gap-y-0.5'>
                    <Text className='text-textLight text-sm font-medium'>You owe</Text>
                    <View className='bg-expense/10 px-3 py-1 rounded-full mt-1'>
                        <AnimatedCurrency
                            value={summary.youOwe}
                            className='text-2xl font-bold text-text'
                        />
                    </View>
                </View>

                {/* YOU ARE OWED */}
                <View className='flex flex-col items-center justify-center gap-y-0.5'>
                    <Text className='text-textLight text-sm font-medium'>You get</Text>
                    <View className='bg-income/10 px-3 py-1 rounded-full mt-1'>
                        <AnimatedCurrency
                            value={summary.youAreOwed}
                            className='text-2xl font-bold text-text'
                        />
                    </View>
                </View>

                {/* PERSONAL */}
                <View className='flex flex-col items-center justify-center gap-y-0.5'>
                    <Text className='text-textLight text-sm font-medium'>Personal</Text>
                    <AnimatedCurrency
                        value={summary.personalBalance}
                        className='text-2xl font-bold text-text'
                    />
                </View>
            </View>
        </View>
    );
}
