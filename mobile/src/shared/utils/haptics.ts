import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const haptic = {
    light: () => ReactNativeHapticFeedback.trigger('impactLight'),
    success: () => ReactNativeHapticFeedback.trigger('notificationSuccess'),
    error: () => ReactNativeHapticFeedback.trigger('notificationError'),
};
