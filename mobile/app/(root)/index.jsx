import { useEffect } from 'react';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { styles } from '@/assets/styles/home.styles';
import { SignOutButton } from '@/components/SignOutButton';
import { useTransactions } from '@/hooks/use-transactions';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';

export default function HomePage() {
    const { user } = useUser();
    const {
        transactions,
        summary,
        loading,
        loadData,
        deleteTransaction
    } = useTransactions(user.id);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <View style={styles.container}>
            <Text type="title">Welcome!</Text>
            <SignedOut>
                <Link href="/(auth)/sign-in">
                    <Text>Sign in</Text>
                </Link>
                <Link href="/(auth)/sign-up">
                    <Text>Sign up</Text>
                </Link>
            </SignedOut>
            <SignedIn>
                <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
                <SignOutButton />
            </SignedIn>
        </View>
    );
}
