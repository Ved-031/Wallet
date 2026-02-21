import { cn } from "@/shared/utils/cn";
import { Text, View } from "react-native";

interface SectionCardProps {
    children: React.ReactNode;
    className?: string;
}

export const SectionCard = ({ children, className }: SectionCardProps) => {
    return (
        <View
            className={cn(
                'bg-card rounded-[20px] p-4 mx-4 mb-4 border border-border',
                className,
            )}
        >
            {children}
        </View>
    );
}

interface SectionTitleProps {
    title: string;
    subtitle?: string;
}

export const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
    return (
        <View className='mb-[14px]'>
            <Text className='text-text text-[16px] font-semibold'>{title}</Text>
            {subtitle && (
                <Text className='text-textLight text-[12px] mt-[3px]'>{subtitle}</Text>
            )}
        </View>
    );
}
