export const formatCurrency = (amount, currencyCode = 'EUR') => {
    if (amount === undefined || amount === null) return '';

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        case 'completed':
            return 'bg-blue-100 text-blue-800';
        case 'active':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-secondary-100 text-secondary-800';
    }
};

export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};