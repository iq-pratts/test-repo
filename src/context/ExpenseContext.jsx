import React, { createContext, useContext, useState, useEffect } from 'react';
import { expensesService } from '@/lib/firestore';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

const ExpenseContext = createContext(undefined);

export function ExpenseProvider({ children }) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Monitor auth state and load expenses when user is authenticated
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            if (user) {
                loadExpenses();
            } else {
                setExpenses([]);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await expensesService.getAll();
            setExpenses(data || []);
        } catch (err) {
            setError(err.message);
            console.error('Failed to load expenses:', err);
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (expense) => {
        try {
            const newExpense = await expensesService.create(expense);
            setExpenses(prev => [newExpense, ...prev]);
            toast.success('Expense added successfully');
            return newExpense;
        } catch (err) {
            console.error('Failed to add expense:', err);
            toast.error(err.message || 'Failed to add expense');
            throw err;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await expensesService.delete(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
            toast.success('Expense deleted successfully');
        } catch (err) {
            console.error('Failed to delete expense:', err);
            toast.error(err.message || 'Failed to delete expense');
            throw err;
        }
    };

    const updateExpense = async (id, updates) => {
        try {
            const updatedExpense = await expensesService.update(id, updates);
            setExpenses(prev =>
                prev.map(e =>
                    e.id === id ? updatedExpense : e
                )
            );
            toast.success('Expense updated successfully');
            return updatedExpense;
        } catch (err) {
            console.error('Failed to update expense:', err);
            toast.error(err.message || 'Failed to update expense');
            throw err;
        }
    };

    const getTotalByCategory = () => {
        const totals = {
            food: 0,
            transport: 0,
            shopping: 0,
            entertainment: 0,
            bills: 0,
            healthcare: 0,
            education: 0,
            travel: 0,
            other: 0,
        };

        expenses.forEach(expense => {
            totals[expense.category] += expense.amount;
        });

        return totals;
    };

    const getMonthlyTotal = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return expenses
            .filter(expense => {
                const expenseDate = new Date(expense.date);
                return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );
            })
            .reduce((sum, expense) => sum + expense.amount, 0);
    };

    const getMonthlyTrend = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trend = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthIndex = date.getMonth();
            const year = date.getFullYear();

            const monthTotal = expenses
                .filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() === monthIndex && expenseDate.getFullYear() === year;
                })
                .reduce((sum, expense) => sum + expense.amount, 0);

            trend.push({
                month: months[monthIndex],
                amount: monthTotal,
            });
        }

        return trend;
    };

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                loading,
                error,
                isAuthenticated,
                addExpense,
                deleteExpense,
                updateExpense,
                loadExpenses,
                getTotalByCategory,
                getMonthlyTotal,
                getMonthlyTrend,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
}
