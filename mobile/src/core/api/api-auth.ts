import { api } from './axios';

let getTokenFn: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (fn: () => Promise<string | null>) => {
    getTokenFn = fn;
};

api.interceptors.request.use(async config => {
    if (!getTokenFn) return config;

    try {
        const token = await getTokenFn();

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.log('Token fetch failed');
    }

    return config;
});
