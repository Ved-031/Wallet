import * as React from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/clerk-expo';
import { COLORS } from '@/shared/constants/colors';
import { styles } from '@assets/styles/auth.styles';
import ErrorBanner from '@/shared/components/ErrorBanner';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();

    const [code, setCode] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [emailAddress, setEmailAddress] = React.useState('');
    const [showEmailCode, setShowEmailCode] = React.useState(false);

    const validate = () => {
        if (!emailAddress || !password) {
            setErrorMsg("All fields are required");
            return false;
        }

        return true;
    };

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded || !validate()) return;
        try {
            setLoading(true);
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });
            if (signInAttempt.status === 'complete') {
                await setActive({
                    session: signInAttempt.createdSessionId,
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            return;
                        }
                        router.replace('/(app)/(tabs)/home');
                    },
                });
            } else if (signInAttempt.status === 'needs_second_factor') {
                const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
                    factor => factor.strategy === 'email_code',
                );

                if (emailCodeFactor) {
                    await signIn.prepareSecondFactor({
                        strategy: 'email_code',
                        emailAddressId: emailCodeFactor.emailAddressId,
                    });
                    setShowEmailCode(true);
                }
            } else {
                // setErrorMsg(signInAttempt.longMessage);
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    }, [isLoaded, signIn, setActive, router, emailAddress, password]);

    const onVerifyPress = React.useCallback(async () => {
        if (!isLoaded || !validate()) return;
        try {
            setLoading(true);
            const signInAttempt = await signIn.attemptSecondFactor({
                strategy: 'email_code',
                code,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({
                    session: signInAttempt.createdSessionId,
                    navigate: async ({ session }) => {
                        if (session?.currentTask) {
                            return;
                        }
                        router.replace('/(app)/(tabs)/home');
                    },
                });
            } else {
                // setErrorMsg(signInAttempt.longMessage);
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    }, [isLoaded, signIn, setActive, router, code]);

    if (showEmailCode) {
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
                    source={require('@assets/images/revenue-i4.png')}
                    style={styles.illustration}
                    contentFit="contain"
                />
                <Text className='mb-8 text-center font-bold text-[32px] text-text'>
                    Welcome Back
                </Text>
                {!!errorMsg && <ErrorBanner errorMsg={errorMsg} setErrorMsg={setErrorMsg} />}
                <TextInput
                    className='bg-card w-full border border-border rounded-xl px-5 py-4 mb-2 placeholder:text-[16px]'
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor="#9A8478"
                    onChangeText={setEmailAddress}
                />
                <TextInput
                    className='bg-card w-full border border-border rounded-xl px-5 py-4 mb-2 placeholder:text-[16px]'
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9A8478"
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                />
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.5 }]}
                    onPress={onSignInPress}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>
                            Sign In
                        </Text>
                    )}
                </TouchableOpacity>
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/sign-up')}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
}
