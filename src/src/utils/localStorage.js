export const getStorageItem = (key) => {
    if (typeof window === 'undefined') return null;

    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error getting item from localStorage:', error);
        return null;
    }
};

export const setStorageItem = (key, value) => {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error setting item in localStorage:', error);
    }
};

export const removeStorageItem = (key) => {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from localStorage:', error);
    }
};
