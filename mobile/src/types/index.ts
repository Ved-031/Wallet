import { Ionicons } from "@expo/vector-icons";

export interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
}

export type IoniconName = keyof typeof Ionicons.glyphMap;
