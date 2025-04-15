import { format, parseISO } from 'date-fns';

export const formatDate = (dateString, formatString = 'PPP') => {
    if (!dateString) return '';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

export const formatTime = (dateString, formatString = 'p') => {
    if (!dateString) return '';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, formatString);
    } catch (error) {
        console.error('Error formatting time:', error);
        return '';
    }
};

export const formatDateTime = (dateString, formatString = 'PPp') => {
    if (!dateString) return '';
    try {
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, formatString);
    } catch (error) {
        console.error('Error formatting date/time:', error);
        return dateString;
    }
};