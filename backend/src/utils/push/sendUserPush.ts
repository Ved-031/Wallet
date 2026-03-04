import { sendPushNotification } from './sendPushNotification';

export async function sendUserPush(
    user: {
        pushToken?: string | null;
        pushEnabled?: boolean;
    },
    title: string,
    body: string,
    data?: Record<string, any>,
) {
    if (!user.pushEnabled) return;
    if (!user.pushToken) return;

    await sendPushNotification({
        token: user.pushToken,
        title,
        body,
        data,
    });
}
