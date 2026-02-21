import { View } from 'react-native';
import AppText from '../ui/AppText';

export default function Section({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <View className="mt-6">
            {title && (
                <AppText variant="subtitle" weight="semibold" className="mb-3">
                    {title}
                </AppText>
            )}
            {children}
        </View>
    );
}
