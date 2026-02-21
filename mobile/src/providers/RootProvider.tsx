import { useFonts } from 'expo-font';
import { PropsWithChildren } from 'react';
import { ClerkProvider, isKnownError, useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
} from "@expo-google-fonts/inter";

import { COLORS } from '@/shared/constants/colors';
import { AuthBridge } from '@/providers/AuthBridge';
import SafeScreen from '@/shared/components/SafeScreen';
import { QueryProvider } from '@/core/query/QueryProvider';
// import AuthSync from '@/features/auth/components/AuthSync';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Props = PropsWithChildren;

export default function RootProviders({ children }: Props) {
    // const { isLoaded } = useAuth();

    const [loaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
        Inter_900Black,
    });

    if (!loaded) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator color={COLORS.primary} size={'large'} />
            </View>
        );
    }

    // if (!isLoaded) {
    //     return (
    //         <View className='flex-1 items-center justify-center bg-background'>
    //             <ActivityIndicator size={'large'} color={COLORS.primary} />
    //         </View>
    //     )
    // }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider
                tokenCache={tokenCache}
                publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            >
                <QueryProvider>
                    <AuthBridge>
                        <SafeScreen>
                            {/* <AuthSync /> */}
                            {children}
                        </SafeScreen>
                    </AuthBridge>
                </QueryProvider>
            </ClerkProvider>
        </GestureHandlerRootView>
    );
}
