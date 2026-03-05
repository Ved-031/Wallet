import { useMutation } from '@tanstack/react-query';
import { registerPushTokenApi } from '../api/registerPushToken';

export const useRegisterPushToken = () => {
    return useMutation({
        mutationFn: registerPushTokenApi,
    });
};
