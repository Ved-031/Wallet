import { queryClient } from './queryClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export const setupQueryPersistence = () => {
    const persister = createAsyncStoragePersister({
        storage: AsyncStorage,
    });

    persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24h cache
    });
};
