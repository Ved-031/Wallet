import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/shared/constants/colors";
import { useCreateTransaction } from "@/features/transactions/hook/useCreateTransaction";

const EXPENSE_CATEGORIES = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Entertainment",
    "Other",
];

const INCOME_CATEGORIES = [
    "Pocket Money",
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other",
];

export default function AddTransactionScreen() {
    const router = useRouter();
    const { mutateAsync, isPending } = useCreateTransaction();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<string | null>(null);
    const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");

    const categories =
        type === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    const handleSave = async () => {
        if (!amount || !title || !category) return;

        await mutateAsync({
            title,
            amount: parseFloat(amount),
            type,
            category,
        });

        router.back();

        setTitle("");
        setAmount("");
        setCategory(null);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background"
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View className="flex-row items-center justify-between p-5 mt-5">
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </Pressable>

                    <Text className="text-text text-xl font-semibold">
                        Add Transaction
                    </Text>

                    <Pressable
                        disabled={isPending}
                        onPress={handleSave}
                        className="flex-row items-center gap-1 disabled:opacity-50"
                    >
                        <Text className="text-primary font-semibold">Save</Text>
                        <Ionicons name="checkmark-outline" size={20} color={COLORS.primary} />
                    </Pressable>
                </View>

                <View className="h-[1px] bg-border mb-4" />

                <View className="m-4 rounded-2xl px-4 mt-6">
                    {/* TYPE TOGGLE */}
                    <View className="flex-row mb-2 gap-[10px]">
                        <Pressable
                            onPress={() => {
                                setType("EXPENSE");
                                setCategory(null);
                            }}
                            className={cn(
                                'flex-1 flex-row items-center justify-center gap-2 py-3 rounded-[25px] border border-border',
                                type === 'EXPENSE' ? 'bg-primary border-primary' : 'bg-card'
                            )}
                        >
                            <Ionicons
                                name='arrow-down-circle'
                                size={22}
                                color={type === 'EXPENSE' ? COLORS.white : COLORS.expense}
                            />
                            <Text
                                className={cn(
                                    'font-medium text-[16px]',
                                    type === 'EXPENSE' ? 'text-white' : 'text-text'
                                )}
                            >
                                Expense
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setType("INCOME");
                                setCategory(null);
                            }}
                            className={cn(
                                'flex-1 flex-row items-center justify-center gap-2 py-3 rounded-[25px] border border-border',
                                type === 'INCOME' ? 'bg-primary border-primary' : 'bg-card'
                            )}
                        >
                            <Ionicons
                                name='arrow-up-circle'
                                size={22}
                                color={type === 'INCOME' ? COLORS.white : COLORS.income}
                            />
                            <Text
                                className={cn(
                                    'font-medium text-[16px]',
                                    type === 'INCOME' ? 'text-white' : 'text-text'
                                )}
                            >
                                Income
                            </Text>
                        </Pressable>
                    </View>

                    {/* AMOUNT */}
                    <View className="flex-row items-center p-4 pb-0 mb-5">
                        <Text className="text-[45px] font-bold text-text mr-2">₹</Text>
                        <TextInput
                            className="flex-1 text-[45px] text-text font-bold"
                            placeholder="0.00"
                            placeholderTextColor={COLORS.textLight}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* TITLE */}
                    <View className="flex-row items-center border border-border rounded-xl p-1 mb-5 bg-white">
                        <Ionicons
                            name='create-outline'
                            size={22}
                            color={COLORS.textLight}
                            className="ml-3 mr-2"
                        />
                        <TextInput
                            className="flex-1 p-3 text-[16px] text-text"
                            placeholder="Transaction Title"
                            placeholderTextColor={COLORS.textLight}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    {/* CATEGORY */}
                    <Text className="my-4 flex-row gap-2 items-center text-lg font-semibold text-text">
                        Category
                    </Text>
                    <View className="flex-row flex-wrap gap-[10px]">
                        {categories.map((item) => {
                            const selected = category === item;
                            return (
                                <Pressable
                                    key={item}
                                    onPress={() => setCategory(item)}
                                    className={cn(
                                        'flex-row items-center px-4 py-2 rounded-full border border-border bg-white',
                                        selected && 'bg-primary border-primary'
                                    )}
                                >
                                    <Text className={`text-[14px] ${selected ? "text-white" : "text-text"}`}>
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* LOADER */}
                    {isPending && <ActivityIndicator size="small" color={COLORS.primary} className="mt-5" />}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
