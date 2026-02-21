import AppText from './AppText';

type Props = {
    amount: number;
    size?: 'lg' | 'xl' | '2xl';
};

export default function AmountText({ amount }: Props) {
    const positive = amount >= 0;

    return (
        <AppText
            variant="amount"
            weight="semibold"
            className={positive ? 'text-income' : 'text-expense'}
        >
            ₹{Math.abs(amount).toLocaleString()}
        </AppText>
    );
}
