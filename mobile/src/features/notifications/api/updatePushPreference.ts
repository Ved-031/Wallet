import { api } from "@/core/api/axios";

export const updatePushPreference = async (enabled: boolean) => {
    const res = await api.patch('/notifications/toggle', {
        enabled,
    });

    return res.data;
};
