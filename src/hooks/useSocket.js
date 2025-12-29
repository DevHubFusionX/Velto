import { useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useSocket = () => {
    const { user } = useAuth();
    const socketRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        // Initialize socket connection
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to socket server');
            // Join private room
            socket.emit('join', user.id || user._id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [user]);

    const on = useCallback((event, callback) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    }, []);

    const off = useCallback((event, callback) => {
        if (socketRef.current) {
            socketRef.current.off(event, callback);
        }
    }, []);

    const emit = useCallback((event, data) => {
        if (socketRef.current) {
            socketRef.current.emit(event, data);
        }
    }, []);

    return { on, off, emit, socket: socketRef.current };
};
