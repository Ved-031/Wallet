import { api } from '@/core/api/axios';

export const acceptInvite = (id: number) => api.post(`/invites/${id}/accept`);

export const declineInvite = (id: number) => api.post(`/invites/${id}/decline`);
