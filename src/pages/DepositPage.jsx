import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirect to crypto deposit page - platform is crypto only
const DepositPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/deposit/crypto', { replace: true });
    }, [navigate]);

    return null;
};

export default DepositPage;
