import { cn } from '@/shared/utils/cn';
import { View, ViewProps } from 'react-native';

export default function AppCard({ className, ...props }: ViewProps & { className?: string }) {
    return (
        <View
            {...props}
            className={cn(
                'bg-card rounded-3xl p-4 shadow-sm border border-border',
                className
            )}
        />
    );
}
