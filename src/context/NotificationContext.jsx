import { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const socket = useSocket();

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const data = await userService.getNotifications();
            const normalizedData = (data || []).map(n => ({
                ...n,
                id: n.id || n._id // Ensure we have a string ID
            }));
            setNotifications(normalizedData);
            setUnreadCount(normalizedData.filter(n => !n.read).length);
        } catch (error) {
            // Silence 503 (Maintenance Mode) errors to prevent console flooding
            if (error.response?.status === 503) {
                console.log('Notification fetch skipped: System under maintenance');
            } else {
                console.error('Failed to fetch notifications:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    useEffect(() => {
        if (!user || !socket) return;

        const handleNewNotification = (data) => {
            const normalized = {
                ...data,
                id: data.id || data._id
            };
            setNotifications(prev => [normalized, ...prev]);
            setUnreadCount(prev => prev + 1);
        };

        socket.on('notification', handleNewNotification);

        return () => {
            socket.off('notification', handleNewNotification);
        };
    }, [user, socket]);

    const markAsRead = async (id) => {
        try {
            await userService.markNotificationRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
            if (unreadIds.length === 0) return;

            await Promise.all(unreadIds.map(id => userService.markNotificationRead(id)));

            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            refresh: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
};
