import * as React from 'react';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/clerk-expo';
import { styles } from '@/assets/styles/auth.styles';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Page() {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [code, setCode] = React.useState('');
    const [errorMsg, setErrorMsg] = React.useState('');
    const [password, setPassword] = React.useState('');
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
            });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err) {
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

                        router.replace('/');
                    },
                });
            } else {
                setErrorMsg(signUpAttempt.longMessage);
                console.error(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err) {
            setErrorMsg(err.errors[0].longMessage);
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    if (pendingVerification) {
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
                    source={require('@/assets/images/revenue-i2.png')}
                    style={styles.illustration}
                    contentFit="contain"
                />
                <Text style={styles.title}>Create Account</Text>
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
                    style={[styles.input, errorMsg && styles.errorInput]}
                    autoCapitalize="none"
                    value={emailAddress}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor="#9A8478"
                    onChangeText={email => setEmailAddress(email)}
                />
                <TextInput
                    style={[styles.input, errorMsg && styles.errorInput]}
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
                    <Text style={styles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
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
