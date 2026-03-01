import { Notification } from '../types';
import { markAsRead, markAllRead } from '../api/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useReadNotification = () => {
    const qc = useQueryClient();

    const readOne = useMutation({
        mutationFn: markAsRead,

        onMutate: async (id: number) => {
            await qc.cancelQueries({ queryKey: ['notifications'] });

            const prev = qc.getQueryData<Notification[]>(['notifications']);

            qc.setQueryData<Notification[]>(
                ['notifications'],
                old => old?.map(n => (n.id === id ? { ...n, read: true } : n)) || [],
            );

            return { prev };
        },

        onError: (_err, _id, ctx) => {
            if (ctx?.prev) qc.setQueryData(['notifications'], ctx.prev);
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const readAll = useMutation({
        mutationFn: markAllRead,

        onMutate: async () => {
            await qc.cancelQueries({ queryKey: ['notifications'] });

            const prev = qc.getQueryData<Notification[]>(['notifications']);

            qc.setQueryData<Notification[]>(
                ['notifications'],
                old => old?.map(n => ({ ...n, read: true })) || [],
            );

            return { prev };
        },

        onError: (_err, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(['notifications'], ctx.prev);
        },

        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return { readOne, readAll };
};
