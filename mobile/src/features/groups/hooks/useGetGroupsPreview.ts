import { api } from "@/core/api/axios";
import { GroupPreview } from "../types";
import { useQuery } from "@tanstack/react-query";

export const useGetGroupsPreview = () => {
    return useQuery({
        queryKey: ['groups-preview'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/groups-preview');
            return data.data as GroupPreview[];
        },
    });
};
