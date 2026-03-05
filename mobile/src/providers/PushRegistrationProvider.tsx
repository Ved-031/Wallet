import { useEffect } from "react";
import { registerPushToken } from "@/shared/utils/push/registerPushToken";
import { useRegisterPushToken } from "@/features/notifications/hooks/useRegisterPushToken";

export default function PushRegistrationProvider({ children }: any) {
    const registerPush = useRegisterPushToken();

    useEffect(() => {
        const initPush = async () => {
            const token = await registerPushToken();

            if (token) {
                registerPush.mutate(token);
            }
        };

        initPush();
    }, []);

    return children;
}
