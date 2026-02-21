import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { useUser } from '@clerk/clerk-expo';

const RootLayout = () => {
    const { isSignedIn, isLoaded } = useUser();

    if(!isLoaded) return null;
    if(!isSignedIn) return <Redirect href={'/sign-in'} />

    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
};

export default RootLayout;
