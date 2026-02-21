import { Text } from 'react-native';
import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedReaction,
    runOnJS,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { formatCurrency } from '@/shared/utils/currency';

export default function AnimatedCurrency({ value, className }: { value: number, className?: string }) {
    const animatedValue = useSharedValue(0);
    const [display, setDisplay] = useState(0);

    // animate
    useEffect(() => {
        animatedValue.value = withTiming(value, {
            duration: Math.min(1200, Math.max(400, Math.abs(value) * 0.4)),
        });
    }, [value]);

    // bridge animated value → React state
    useAnimatedReaction(
        () => animatedValue.value,
        (current) => {
            runOnJS(setDisplay)(current);
        }
    );

    return (
        <Text className={className}>
            {formatCurrency(display)}
        </Text>
    );
}
