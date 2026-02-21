import { View } from 'react-native';

export const Skeleton = ({ className = '' }) => {
    return (
        <View className={`bg-border/40 rounded-xl animate-pulse ${className}`} />
    );
};
