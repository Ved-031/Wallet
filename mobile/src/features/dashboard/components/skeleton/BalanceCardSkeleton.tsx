import { View } from 'react-native';
import { Skeleton } from '@/shared/components/Skeleton';

export default function BalanceCardSkeleton() {
    return (
        <View className="bg-card rounded-3xl p-5 shadow-md">
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-12 w-48 mb-6" />

            <View className="flex-row justify-between">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
            </View>
        </View>
    );
}
