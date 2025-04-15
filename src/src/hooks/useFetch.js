import { useState, useEffect, useCallback } from 'react';
import axios from '@/lib/axios';

export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { immediate = true } = options;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(url);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while fetching data');
            return null;
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [fetchData, immediate]);

    const refetch = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
};