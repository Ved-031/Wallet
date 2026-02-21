import { COLORS } from '@/shared/constants/colors';
import { ActivityIndicator, View } from 'react-native';
import { styles } from '../../../assets/styles/home.styles';

export const PageLoader = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
};
