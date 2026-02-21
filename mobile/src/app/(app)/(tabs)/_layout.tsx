import { Tabs } from 'expo-router';
import { cn } from '@/shared/utils/cn';
import * as Haptics from 'expo-haptics';
import { useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { COLORS } from '@/shared/constants/colors';
import { Pressable, Text, View } from 'react-native';
import { AddButtonSheet } from '@/features/dashboard/components/AddButtonSheet';

const TabItemLabel = ({ label, focused }: { label: string; focused: boolean }) => {
    return (
        <Text
            className={cn(
                'text-textLight mt-[2px] text-[12px]',
                focused && 'font-semibold text-text'
            )}
        >
            {label}
        </Text>
    );
}

export default function TabsLayout() {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const openBottomSheet = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        bottomSheetRef.current?.expand();
    }, []);

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.textLight,
                    tabBarStyle: {
                        height: 90,
                        paddingBottom: 10,
                        paddingTop: 14,
                        borderTopWidth: 0,
                        elevation: 0,
                        backgroundColor: COLORS.card,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        marginTop: 2,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                color={focused ? COLORS.text : color}
                                size={size}
                            />
                        ),
                        tabBarLabel: ({ focused }) => <TabItemLabel label="Home" focused={focused} />,
                    }}
                />

                <Tabs.Screen
                    name="insights"
                    options={{
                        title: 'Insights',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons
                                name={focused ? 'stats-chart' : 'stats-chart-outline'}
                                color={focused ? COLORS.text : color}
                                size={size}
                            />
                        ),
                        tabBarLabel: ({ focused }) => <TabItemLabel label="Insights" focused={focused} />,
                    }}
                />

                <Tabs.Screen
                    name="add"
                    options={{
                        title: '',
                        tabBarButton: () => (
                            <Pressable
                                onPress={openBottomSheet}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 65,
                                        height: 65,
                                        borderRadius: 25,
                                        backgroundColor: COLORS.primary,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 75,
                                    }}
                                >
                                    <Ionicons name="add" color="white" size={30} />
                                </View>
                            </Pressable>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="activity"
                    options={{
                        title: 'Activity',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons
                                name={focused ? 'time' : 'time-outline'}
                                color={focused ? COLORS.text : color}
                                size={size}
                            />
                        ),
                        tabBarLabel: ({ focused }) => <TabItemLabel label="Activity" focused={focused} />,
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                color={focused ? COLORS.text : color}
                                size={size}
                            />
                        ),
                        tabBarLabel: ({ focused }) => <TabItemLabel label="Profile" focused={focused} />,
                    }}
                />
            </Tabs>

            <AddButtonSheet ref={bottomSheetRef} />
        </>
    );
}
