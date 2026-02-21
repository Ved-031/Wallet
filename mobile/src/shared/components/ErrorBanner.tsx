import React from 'react'
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
    errorMsg: string;
    setErrorMsg: React.Dispatch<React.SetStateAction<string>>
}

const ErrorBanner = ({ errorMsg, setErrorMsg }: Props) => {
    return (
        <View className="bg-[#FFE5E5] p-3 rounded-[8px] border-l-4 border-l-expense mb-4 flex-row items-center w-full">
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text className="text-text ml-2 flex-1 text-[14px]">{errorMsg}</Text>
            <TouchableOpacity onPress={() => setErrorMsg('')}>
                <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
        </View>
    )
}

export default ErrorBanner
