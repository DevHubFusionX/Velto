import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast as toastEmitter } from '../utils/toastEmitter';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    useEffect(() => {
        const unsubscribe = toastEmitter.subscribe((message, type) => {
            addToast(message, type);
        });
        return () => unsubscribe();
    }, [addToast]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const icons = {
        success: <CheckCircle size={20} className="text-[#a3e635]" />,
        error: <AlertCircle size={20} className="text-red-400" />,
        info: <Info size={20} className="text-blue-400" />,
    };

    const colors = {
        success: 'border-[#a3e635]/20 bg-[#a3e635]/5',
        error: 'border-red-500/20 bg-red-500/5',
        info: 'border-blue-500/20 bg-blue-500/5',
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[300px] flex items-center justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-in ${colors[toast.type]}`}
                    >
                        <div className="flex items-center gap-3">
                            {icons[toast.type]}
                            <p className="text-sm font-medium text-white">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
