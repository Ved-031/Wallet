export const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return '₹0';

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};
