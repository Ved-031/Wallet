import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { COLORS } from '@/shared/constants/colors';
import {
    View,
    Text,
    Image,
    TextInput,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';

const EditProfileScreen = () => {
    const router = useRouter();
    const { user } = useUser();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        setName(
            user.fullName ?
                `${user.firstName} ${user.lastName}` :
                user.emailAddresses[0].emailAddress.split('@')[0]
        );

        setImage(user.imageUrl ? user.imageUrl : null);
    }, [user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled) {
            const file = result.assets[0];
            setImage(file.uri);

            try {
                setLoading(true);

                await user?.setProfileImage({
                    file: {
                        uri: file.uri,
                        name: file.fileName || 'avatar.jpg',
                        type: 'image/jpeg',
                    } as any,
                });

                await user?.reload();
                // await syncMutation.mutateAsync();

            } catch (e) {
                Alert.alert('Error', 'Failed to update profile picture');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return;

        const [first, ...rest] = name.trim().split(' ');
        const last = rest.join(' ');

        try {
            setLoading(true);

            await user?.update({
                firstName: first,
                lastName: last || '',
            });

            await user?.reload();

            router.back();
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <View className="flex-1 bg-background px-5">

            {/* HEADER */}
            <View className="flex-row items-center justify-between pt-10 pb-5">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>

                <Text className="text-text text-2xl font-semibold">
                    Edit Profile
                </Text>

                <View style={{ width: 24 }} />
            </View>

            {/* AVATAR */}
            <View className="items-center mt-4">
                <Pressable onPress={pickImage}>
                    <View>
                        <Image
                            source={
                                image
                                    ? { uri: image }
                                    : user.imageUrl
                                        ? { uri: user.imageUrl }
                                        : require('@assets/images/logo.png')
                            }
                            className="w-28 h-28 rounded-full"
                            resizeMode="cover"
                        />

                        <View className="absolute bottom-0 right-0 bg-primary w-9 h-9 rounded-full items-center justify-center">
                            <Ionicons name="camera" size={18} color="white" />
                        </View>
                    </View>
                </Pressable>

                <Text className="text-textLight mt-3">
                    Tap to change photo
                </Text>
            </View>

            {/* FORM CARD */}
            <View className="bg-card rounded-3xl px-5 py-6 shadow-sm w-full mt-8 gap-6">
                {/* NAME */}
                <View>
                    <View className="flex-row items-center gap-2 mb-2">
                        <Ionicons
                            name="person-outline"
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className="text-textLight font-medium text-[15px]">
                            Full Name
                        </Text>
                    </View>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                        className="bg-background border border-border rounded-xl px-4 py-3 text-text text-[16px]"
                        placeholderTextColor={COLORS.textLight}
                    />
                </View>

                {/* EMAIL (READ ONLY) */}
                <View>
                    <View className="flex-row items-center gap-2 mb-2">
                        <Ionicons
                            name="mail-outline"
                            size={18}
                            color={COLORS.textLight}
                        />
                        <Text className="text-textLight font-medium text-[15px]">
                            Email
                        </Text>
                    </View>

                    <View className="bg-background border border-border rounded-xl px-4 py-3">
                        <Text className="text-text text-[16px]">
                            {user.emailAddresses[0].emailAddress}
                        </Text>
                    </View>
                </View>
            </View>

            {/* SAVE BUTTON */}
            <Pressable
                onPress={handleSave}
                disabled={loading}
                className="bg-primary mt-10 py-4 rounded-2xl items-center justify-center shadow-md"
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-[16px] font-semibold">
                        Save Changes
                    </Text>
                )}
            </Pressable>
        </View>
    );
};

export default EditProfileScreen;
