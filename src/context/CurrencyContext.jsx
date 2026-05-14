import { createContext, useContext } from 'react';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
    const currency = 'USD';

    const formatAmount = (amount) => {
        const val = amount || 0;
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatCrypto = (amount, symbol) => {
        const val = amount || 0;
        return `${val.toFixed(8)} ${symbol}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, formatAmount, formatCrypto }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
    return context;
};
