import { api } from "@/core/api/axios";
import { GroupExpenseApiRes } from "../types";
import { useQuery } from "@tanstack/react-query";

export const useGetGroupExpenses = (id: number) => {
    return useQuery({
        queryKey: ['group-expenses', id],
        queryFn: async () => {
            const { data } = await api.get(`/expenses/group/${id}`);
            return data as GroupExpenseApiRes;
        },
    });
};
