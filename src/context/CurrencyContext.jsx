import React, { createContext, useContext, useState, useMemo } from 'react';



export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];

export const CURRENCY_DETAILS = {
    INR: { symbol: '₹', name: 'Indian Rupee' },
    USD: { symbol: '$', name: 'US Dollar' },
    EUR: { symbol: '€', name: 'Euro' },
    GBP: { symbol: '£', name: 'British Pound' },
    JPY: { symbol: '¥', name: 'Japanese Yen' },
};




const CurrencyContext = createContext(undefined);

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('INR');

    const formatCurrency = (value, options) => {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency,
            ...options,
        }).format(value);
    };

    const value = useMemo(() => ({
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol: CURRENCY_DETAILS[currency].symbol,
    }), [currency]);


    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
