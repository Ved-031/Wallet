import { Group } from "../types";
import { api } from "@/core/api/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetGroupDetails = (id: number) => {
    return useQuery({
        queryKey: ['group-details', id],
        queryFn: async () => {
            const { data } = await api.get(`/groups/${id}`);
            return data.data as Group;
        },
    });
};
