import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('NGN');

  const formatAmount = (amount) => {
    const val = amount || 0;
    if (currency === 'NGN') {
      return `₦${val.toLocaleString()}`;
    }
    return `$${val.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
