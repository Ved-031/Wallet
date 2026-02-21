import { queryClient } from './queryClient';
import { PropsWithChildren, useEffect } from 'react';
import { setupQueryPersistence } from './queryPersister';
import { QueryClientProvider } from '@tanstack/react-query';

export const QueryProvider = ({ children }: PropsWithChildren) => {

    useEffect(() => {
        setupQueryPersistence();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
