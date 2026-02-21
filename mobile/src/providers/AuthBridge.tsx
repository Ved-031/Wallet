import { useAuth } from '@clerk/clerk-expo';
import { PropsWithChildren, useEffect } from 'react';
import { setAuthTokenGetter } from '@/core/api/api-auth';

export const AuthBridge = ({ children }: PropsWithChildren) => {
    const { getToken } = useAuth();

    useEffect(() => {
        setAuthTokenGetter(getToken);
    }, [getToken]);

    return children;
};
