export type User = {
    id: number;
    clerkId: string;
    name: string | null;
    email: string;
    avatar: string | null;
    pushToken: string | null;
    pushEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
