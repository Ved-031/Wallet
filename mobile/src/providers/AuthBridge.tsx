import { useAuth } from '@clerk/clerk-expo';
import { useQueryClient } from '@tanstack/react-query';
import { setAuthTokenGetter } from '@/core/api/api-auth';
import { PropsWithChildren, useEffect, useRef } from 'react';

export const AuthBridge = ({ children }: PropsWithChildren) => {
    const { getToken, userId: clerkId, isSignedIn } = useAuth();
    const queryClient = useQueryClient();
    const previousUser = useRef<string | null>(null);

    useEffect(() => {
        setAuthTokenGetter(getToken);
    }, [getToken]);

    useEffect(() => {
        if (!isSignedIn) {
            queryClient.clear();
            previousUser.current = null;
            return;
        }

        if (previousUser.current && previousUser.current !== clerkId) {
            queryClient.clear();
        }

        previousUser.current = clerkId ?? null;
    }, [clerkId, isSignedIn]);

    return children;
};
