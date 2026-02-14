import * as React from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn } from '@clerk/clerk-expo';
import { styles } from '@/assets/styles/auth.styles';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Page() {
    const router = useRouter();
    const { signIn, setActive, isLoaded } = useSignIn();

    const [code, setCode] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [emailAddress, setEmailAddress] = React.useState('');
    const [showEmailCode, setShowEmailCode] = React.useState(false);

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return;
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
                        router.replace('/');
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
                setErrorMsg(signInAttempt.longMessage);
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    }, [isLoaded, signIn, setActive, router, emailAddress, password]);

    const onVerifyPress = React.useCallback(async () => {
        if (!isLoaded) return;
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
                        router.replace('/');
                    },
                });
            } else {
                setErrorMsg(signInAttempt.longMessage);
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    }, [isLoaded, signIn, setActive, router, code]);

    if (showEmailCode) {
        return (
            <View style={styles.verificationContainer}>
                <Text type="title" style={styles.verificationTitle}>
                    Verify your email
                </Text>
                {!!errorMsg ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{errorMsg}</Text>
                        <TouchableOpacity onPress={() => setErrorMsg('')}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}
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
                    source={require('@/assets/images/revenue-i4.png')}
                    style={styles.illustration}
                    contentFit="contain"
                />
                <Text type="title" style={styles.title}>
                    Welcome Back
                </Text>
                {!!errorMsg ? (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
                        <Text style={styles.errorText}>{errorMsg}</Text>
                        <TouchableOpacity onPress={() => setErrorMsg('')}>
                            <Ionicons name="close" size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                ) : null}
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor="#9A8478"
                    onChangeText={emailAddress => setEmailAddress(emailAddress)}
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder="Enter password"
                    placeholderTextColor="#9A8478"
                    secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                />
                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.5 }]}
                    onPress={onSignInPress}
                >
                    <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
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
