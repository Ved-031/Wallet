import * as React from 'react';
import { Image } from 'expo-image';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/clerk-expo';
import { COLORS } from '@/shared/constants/colors';
import { styles } from '@assets/styles/auth.styles';
import ErrorBanner from '@/shared/components/ErrorBanner';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [code, setCode] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [emailAddress, setEmailAddress] = React.useState('');
    const [pendingVerification, setPendingVerification] = React.useState(false);

    const onSignUpPress = async () => {
        if (!isLoaded) return;
        try {
            setLoading(true);
            await signUp.create({
                emailAddress,
                password,
                firstName,
                lastName,
            });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;
        try {
            setLoading(true);
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });
            if (signUpAttempt.status === 'complete') {
                await setActive({
                    session: signUpAttempt.createdSessionId,
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            return;
                        }

                        router.replace('/(app)/(tabs)/home');
                    },
                });
            } else {
                // setErrorMsg(signUpAttempt.longMessage);
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err: any) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) {
        return (
            <View style={styles.verificationContainer}>
                <Text style={styles.verificationTitle}>
                    Verify your email
                </Text>
                {!!errorMsg && <ErrorBanner errorMsg={errorMsg} setErrorMsg={setErrorMsg} />}
                <TextInput
                    style={[styles.verificationInput, !!errorMsg && styles.errorInput]}
                    value={code}
                    placeholder="Enter verification code"
                    placeholderTextColor="#9A8478"
                    onChangeText={code => setCode(code)}
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.5 }]}
                    onPress={onVerifyPress}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Verifying...' : 'Verify Email'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: COLORS.background }}
            contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.background }}
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={100}
        >
            <View style={styles.container}>
                <Image
                    source={require('@assets/images/revenue-i2.png')}
                    style={styles.illustration}
                    contentFit="contain"
                />
                <Text className='mb-8 mt-6 text-center font-bold text-[32px] text-text'>Create Account</Text>
                {!!errorMsg && <ErrorBanner errorMsg={errorMsg} setErrorMsg={setErrorMsg} />}
                <View className='flex-row items-center justify-center gap-2'>
                    <TextInput
                        className={cn(
                            'flex-1 bg-card border border-border rounded-xl p-[17px] text-text mb-4 placeholder:text-[16px]',
                            errorMsg && 'border-expense'
                        )}
                        autoCapitalize='words'
                        value={firstName}
                        placeholder='First Name'
                        placeholderTextColor="#9A8478"
                        onChangeText={val => setFirstName(val)}
                    />
                    <TextInput
                        className={cn(
                            'flex-1 bg-card border border-border rounded-xl p-[17px] text-text mb-4 placeholder:text-[16px]',
                            errorMsg && 'border-expense'
                        )}
                        autoCapitalize='words'
                        value={lastName}
                        placeholder='Last Name'
                        placeholderTextColor="#9A8478"
                        onChangeText={val => setLastName(val)}
                    />
                </View>
                <TextInput
                    className={cn(
                        'w-full bg-card border border-border rounded-xl p-[17px] text-text mb-4 placeholder:text-[16px]',
                        errorMsg && 'border-expense'
                    )}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor="#9A8478"
                    onChangeText={email => setEmailAddress(email)}
                />
                <TextInput
                    className={cn(
                        'w-full bg-card border border-border rounded-xl p-[17px] text-text mb-4 placeholder:text-[16px]',
                        errorMsg && 'border-expense'
                    )}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9A8478"
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                />
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.5 }]}
                    onPress={onSignUpPress}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>
                            Sign Up
                        </Text>
                    )}
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => router.replace('/sign-in')}>
                        <Text style={styles.linkText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
