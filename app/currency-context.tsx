'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'EGP' | 'SDG';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Define exchange rates for MVP. 
// In a real application, these would be fetched from an API.
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EGP: 48.5,
  SDG: 600, // Dummy rate
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EGP: 'ر.س', // Not quite accurate (SAR) but using what the design html had, or 'ج.م' for EGP
  SDG: 'ج.س',
};

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>('USD');

  // Load currency from localStorage on mount
  useEffect(() => {
    let active = true;
    const initCurrency = async () => {
      const savedCurrency = localStorage.getItem('vision_currency') as Currency;
      if (savedCurrency && EXCHANGE_RATES[savedCurrency] && active) {
        setCurrency(savedCurrency);
      }
    };
    initCurrency();
    return () => {
      active = false;
    };
  }, []);

  const handleSetCurrency = (newVal: Currency) => {
    setCurrency(newVal);
    localStorage.setItem('vision_currency', newVal);
  };

  const formatPrice = (priceInUSD: number) => {
    const rate = EXCHANGE_RATES[currency];
    const converted = priceInUSD * rate;
    
    return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'ar-EG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
