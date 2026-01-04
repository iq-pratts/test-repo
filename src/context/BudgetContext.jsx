import { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
    const [budget, setBudget] = useState(() => {
        const savedBudget = localStorage.getItem('monthlyBudget');
        return savedBudget ? parseFloat(savedBudget) : 5000; // Default budget
    });

    useEffect(() => {
        localStorage.setItem('monthlyBudget', budget);
    }, [budget]);

    const updateBudget = (newBudget) => {
        setBudget(newBudget);
    };

    return (
        <BudgetContext.Provider value={{ budget, updateBudget }}>
            {children}
        </BudgetContext.Provider>
    );
};
