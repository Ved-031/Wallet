export type PushPayload = {
    token: string;
    title: string;
    body: string;
    data?: Record<string, any>;
};

export async function sendPushNotification(payload: PushPayload) {
    const { token, title, body, data } = payload;

    if (!token) return;

    try {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                sound: 'default',
                title,
                body,
                data,
            }),
        });
    } catch (error) {
        console.error('Push notification failed:', error);
    }
}
