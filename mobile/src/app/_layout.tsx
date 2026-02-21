import '../../global.css';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import RootProviders from '@/providers/RootProvider';

export default function RootLayout() {
    return (
        <RootProviders>
            <Slot />
            <StatusBar style="dark" />
        </RootProviders>
    );
}
