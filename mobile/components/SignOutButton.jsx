import { useRouter } from 'expo-router';
import { useClerk } from '@clerk/clerk-expo';
import { Text, TouchableOpacity } from 'react-native';

export const SignOutButton = () => {
    const router = useRouter();
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/');
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    return (
        <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign out</Text>
        </TouchableOpacity>
    );
};
