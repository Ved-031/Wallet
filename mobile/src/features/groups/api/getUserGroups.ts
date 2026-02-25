import { api } from "@/core/api/axios";

export const getUserGroupsPreview = async () => {
    const { data } = await api.get('/dashboard/groups-preview');
    return data.data;
}
