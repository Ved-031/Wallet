import { View } from 'react-native';
import { Skeleton } from '@/shared/components/Skeleton';

export default function ActivitySkeleton() {
    return (
        <View className="mt-6">
            {[...Array(3)].map((_, i) => (
                <View key={i} className="flex-row items-center py-3">
                    <Skeleton className="w-11 h-11 rounded-full" />
                    <View className="flex-1 ml-3">
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-3 w-24" />
                    </View>
                    <Skeleton className="h-4 w-16" />
                </View>
            ))}
        </View>
    );
}
