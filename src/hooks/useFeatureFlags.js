import { useState, useEffect } from 'react';
import { userService } from '../services';

export const useFeatureFlags = () => {
    const [flags, setFlags] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                const data = await userService.getDashboard();
                setFlags(data.featureFlags || {});
            } catch (error) {
                console.error('Failed to fetch feature flags:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlags();
    }, []);

    const isEnabled = (key) => {
        return !!flags[key];
    };

    return { flags, isEnabled, loading };
};
