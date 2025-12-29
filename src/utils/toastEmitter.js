const subscribers = new Set();

export const toast = {
    success: (message) => notify(message, 'success'),
    error: (message) => notify(message, 'error'),
    info: (message) => notify(message, 'info'),
    subscribe: (callback) => {
        subscribers.add(callback);
        return () => subscribers.delete(callback);
    }
};

const notify = (message, type) => {
    subscribers.forEach(callback => callback(message, type));
};
