import { View, Text, Pressable } from "react-native";
import { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
    const message =
        error instanceof Error ? error.message : "Unexpected error occurred";

    return (
        <View className="flex-1 items-center justify-center bg-background px-6">
            <Text className="text-text text-xl font-semibold mb-2">
                Something went wrong
            </Text>

            <Text className="text-textLight text-center mb-6">
                {message}
            </Text>

            <Pressable
                onPress={resetErrorBoundary}
                className="bg-primary px-6 py-3 rounded-xl"
            >
                <Text className="text-white font-semibold">
                    Try Again
                </Text>
            </Pressable>
        </View>
    );
}
