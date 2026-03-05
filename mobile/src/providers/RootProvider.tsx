import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { COLORS } from '@/shared/constants/colors';
import * as Notifications from 'expo-notifications';
import { AuthBridge } from '@/providers/AuthBridge';
import { PropsWithChildren, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import SafeScreen from '@/shared/components/SafeScreen';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { QueryProvider } from '@/core/query/QueryProvider';
import { useAppRefresh } from '@/shared/hooks/useAppRefresh';
import PushRegistrationProvider from './PushRegistrationProvider';
import AppErrorBoundary from '@/shared/components/AppErrorBoundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReadNotification } from '@/features/notifications/hooks/useReadNotification';
import { ActivitySheetProvider } from '@/features/activity/context/ActivitySheetContext';
import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
} from "@expo-google-fonts/inter";


type Props = PropsWithChildren;

export default function RootProviders({ children }: Props) {
    const router = useRouter();
    const { readOne } = useReadNotification();

    useAppRefresh();

    useEffect(() => {
        const subscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                const data = response.notification.request.content.data as any;

                if (!data) return;

                const { type, groupId, notificationId } = data;

                if (notificationId) {
                    readOne.mutate(notificationId);
                }

                if (type === 'GROUP_INVITE') {
                    router.push(`/(app)/(tabs)/groups`);
                    return;
                }

                if (groupId) {
                    router.push(`/(app)/groups/${data.groupId}`);
                }
            }
        );

        return () => subscription.remove();
    }, []);

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

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ClerkProvider
                tokenCache={tokenCache}
                publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
            >
                <AppErrorBoundary>
                    <QueryProvider>
                        <PushRegistrationProvider>
                            <AuthBridge>
                                <SafeScreen>
                                    <ActivitySheetProvider>
                                        {children}
                                    </ActivitySheetProvider>
                                </SafeScreen>
                            </AuthBridge>
                        </PushRegistrationProvider>
                    </QueryProvider>
                </AppErrorBoundary>
            </ClerkProvider>
        </GestureHandlerRootView>
    );
}
