import React, { createContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/notifications');
            setNotifications(response.data);
            setUnreadCount(response.data.filter(notif => !notif.is_read).length);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch
    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user, fetchNotifications]);

    // Mark a notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await axios.put(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, is_read: 1 } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await axios.put('/notifications/read-all');
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, is_read: 1 }))
            );
            setUnreadCount(0);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    }, []);

    // Show a toast notification
    const showNotification = useCallback((message, type = 'info') => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,
                error,
                fetchNotifications,
                markAsRead,
                markAllAsRead,
                showNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
