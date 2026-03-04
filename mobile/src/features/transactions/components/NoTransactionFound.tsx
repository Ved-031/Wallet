import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { View, Text, TouchableOpacity } from 'react-native';

const NoTransactionFound = () => {
    const router = useRouter();

    return (
        <View className='bg-card rounded-2xl p-[30px] items-center justify-center mt-[10px] shadow-sm shadow-shadow'>
            <Ionicons
                name="receipt-outline"
                size={60}
                color={COLORS.textLight}
                className='mb-4'
            />
            <Text className='text-lg font-semibold text-text mb-2'>No transactions yet</Text>
            <Text className='text-textLight text-[14px] text-center mb-5 leading-5'>
                Start tracking your finances by adding your first transaction
            </Text>
            <TouchableOpacity
                className='bg-primary flex-row items-center py-[10px] px-4 rounded-[20px] shadow-sm shadow-black'
                onPress={() => router.push('/(app)/transactions/create')}
            >
                <Ionicons name="add-circle" size={18} color={COLORS.white} />
                <Text className='text-white font-semibold ml-[6px]'>Add Transaction</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NoTransactionFound;
