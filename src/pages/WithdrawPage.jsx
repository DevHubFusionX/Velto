import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to crypto withdrawal page - platform is crypto only
const WithdrawPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/withdraw/crypto', { replace: true });
    }, [navigate]);
    
    return null;
};

export default WithdrawPage;
