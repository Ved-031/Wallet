import { useGetNotifications } from "./useGetNotifications";

export const useUnreadCount = () => {
    const { data } = useGetNotifications();

    if (!data) return 0;

    return data.filter((n: any) => !n.read).length;
};
