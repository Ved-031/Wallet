import React, { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/shared/constants/colors';
import { useClerk, useUser } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, Image, Switch, Alert, Pressable } from 'react-native';

const ProfileScreen = () => {
    const router = useRouter();
    const { user } = useUser();
    const { signOut } = useClerk();
    const queryClient = useQueryClient();

    const displayName = user?.fullName ?? user?.emailAddresses[0].emailAddress?.split('@')[0] ?? 'User';
    const image = user?.imageUrl ?? null;

    useFocusEffect((
        useCallback(() => {
            user?.reload();
        }, [user])
    ));

    const handleSignOut = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => signOut() },
        ]);
        queryClient.clear();
    };

    return (
        <View className='flex-1 bg-background px-5 items-center justify-center'>
            {/* USER AVATAR */}
            <View className='items-center gap-3 relative'>
                <Image
                    source={image ? { uri: image } : require('@assets/images/logo.png')}
                    className='w-24 h-24 rounded-full object-contain'
                    resizeMode='contain'
                />

                <Pressable
                    onPress={() => router.push('/profile-edit')}
                    className='absolute bottom-0 -right-1 bg-primary rounded-full w-9 h-9 items-center justify-center'
                >
                    <Ionicons
                        name="pencil"
                        size={18}
                        color={COLORS.white}
                    />
                </Pressable>
            </View>

            <Text className='text-text font-semibold text-xl my-4'>
                {displayName}
            </Text>

            <View className='bg-card rounded-3xl px-5 py-6 shadow-sm w-full my-5 gap-5'>
                {/* NAME */}
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='person-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Name</Text>
                    </View>
                    <Text className='text-text font-medium'>{displayName}</Text>
                </View>

                <View className='h-[0.4px] w-full bg-border' />

                {/* EMAIL */}
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='mail-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Email</Text>
                    </View>
                    <Text className='text-text font-medium'>{user?.emailAddresses[0].emailAddress}</Text>
                </View>

                <View className='h-[0.5px] w-full bg-border' />

                {/* PASSWORD */}
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='lock-closed-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Password</Text>
                    </View>
                    <Text className='text-text font-medium'>********</Text>
                </View>
            </View>

            <View className='bg-card rounded-3xl px-5 py-6 shadow-sm w-full mb-5 gap-5'>
                {/* NOTIFICATIONS */}
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='notifications-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Notifications</Text>
                    </View>
                    <Switch
                        value={false}
                        onValueChange={(value) => console.log(value)}
                        trackColor={{ false: COLORS.border, true: COLORS.primary }}
                        thumbColor={COLORS.text}
                        onTouchStart={(e) => e.stopPropagation()}
                        style={{
                            width: 40,
                            height: 20,
                        }}
                    />
                </View>

                <View className='h-[0.4px] w-full bg-border' />

                {/* CHANGE PASSWORD */}
                <Pressable onPress={() => router.push('/change-password')} className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='lock-closed-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Change Password</Text>
                    </View>
                    <Ionicons
                        name='chevron-forward'
                        size={18}
                        color={COLORS.text}
                    />
                </Pressable>

                <View className='h-[0.4px] w-full bg-border' />

                {/* THEME */}
                <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='sunny-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Theme</Text>
                    </View>
                    <Text className='text-text font-medium'>Light</Text>
                </View>
            </View>

            <View className='bg-card rounded-3xl px-5 py-6 shadow-sm w-full mb-5 gap-5'>
                {/* HELP & SUPPORT */}
                <Pressable onPress={() => router.push('/help-support')} className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='help-circle-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Help & Support</Text>
                    </View>
                    <Ionicons
                        name='chevron-forward-outline'
                        size={18}
                        color={COLORS.text}
                    />
                </Pressable>

                <View className='h-[0.5px] w-full bg-border' />

                {/* ABOUT */}
                <Pressable onPress={() => router.push('/about-us')} className='flex-row items-center justify-between'>
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='information-circle-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>About</Text>
                    </View>
                    <Ionicons
                        name='chevron-forward-outline'
                        size={18}
                        color={COLORS.text}
                    />
                </Pressable>
            </View>

            {/* DANGER ZONE */}
            <View className='bg-card rounded-3xl px-5 py-6 shadow-sm w-full mb-5 gap-5'>
                {/* LOGOUT */}
                <Pressable
                    onPress={handleSignOut}
                    className='flex-row items-center justify-between'
                >
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='log-out-outline'
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className='text-textLight font-medium text-[16px]'>Logout</Text>
                    </View>
                    <Ionicons
                        name='chevron-forward-outline'
                        size={20}
                        color={COLORS.text}
                    />
                </Pressable>

                <View className='h-[0.5px] w-full bg-border' />

                {/* DELETE ACCOUNT */}
                <Pressable
                    onPress={() => router.push('/delete-account')}
                    className='flex-row items-center justify-between'
                >
                    <View className='flex-row items-center gap-2'>
                        <Ionicons
                            name='trash-outline'
                            size={18}
                            color={COLORS.expense}
                        />
                        <Text className='text-expense font-medium text-[16px]'>Delete Account</Text>
                    </View>
                    <Ionicons
                        name='chevron-forward-outline'
                        size={20}
                        color={COLORS.expense}
                    />
                </Pressable>
            </View>
        </View>
    )
}

export default ProfileScreen
