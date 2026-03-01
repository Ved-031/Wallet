export const serializeMessage = (message: string, meta?: any) => {
    if (!meta) return message;
    return JSON.stringify({ message, meta });
};

export const deserializeMessage = (raw: string) => {
    try {
        const parsed = JSON.parse(raw);
        if (parsed?.message) return parsed;
    } catch {}
    return { message: raw, meta: null };
};
