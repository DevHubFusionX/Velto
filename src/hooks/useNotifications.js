import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await userService.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await userService.markNotificationRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, error, markAsRead, unreadCount, refetch: fetchNotifications };
};
