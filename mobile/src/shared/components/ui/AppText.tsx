import { cn } from "@/shared/utils/cn";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
    variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'amount';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    className?: string;
}

export default function AppText({
    variant = 'body',
    weight = 'regular',
    className,
    ...props
}: Props) {
    const variantStyle = {
        title: 'text-2xl text-text',
        subtitle: 'text-lg text-text',
        body: 'text-base text-text',
        caption: 'text-sm text-textLight',
        amount: 'text-3xl text-text',
    };

    const weightStyle = {
        regular: 'font-regular',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    };

    return (
        <Text
            {...props}
            className={cn(variantStyle[variant], weightStyle[weight], className)}
        />
    )
}
