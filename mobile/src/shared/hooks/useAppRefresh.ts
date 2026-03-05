import { AppState } from 'react-native';
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useAppRefresh() {
    const queryClient = useQueryClient();
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextState => {
            if (appState.current === 'background' && nextState === 'active') {
                queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
                queryClient.invalidateQueries({ queryKey: ['dashboard-activity'] });
                queryClient.invalidateQueries({ queryKey: ['dashboard-groups'] });
                queryClient.invalidateQueries({ queryKey: ['notifications'] });
            }

            appState.current = nextState;
        });

        return () => subscription.remove();
    }, []);
}
