import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext(null);

/**
 * Currency Context - Crypto Only Platform
 * All balances are displayed in USD equivalent
 * NGN support has been removed
 */
export const CurrencyProvider = ({ children }) => {
  // Platform is crypto-only, balances shown in USD equivalent
  const [currency] = useState('USD');

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
