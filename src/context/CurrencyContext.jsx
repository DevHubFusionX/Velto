import { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('NGN');

  const formatAmount = (amount) => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
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
