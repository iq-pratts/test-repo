import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firestoreService } from '@/services/firestoreService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const ExpenseContext = createContext();

export const useExpenses = () => {
    const context = useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpenseProvider');
    }
    return context;
};

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const { user } = useAuth();

    const loadExpenses = useCallback(async () => {
        if (user) {
            setLoading(true);
            setError(null);
            try {
                const expenseData = await firestoreService.fetchData('expenses', { uid: user.uid, filters });
                setExpenses(expenseData);
            } catch (err) {
                console.error("Error fetching expenses: ", err);
                setError(err.message);
                setExpenses([]);
            }
            setLoading(false);
        } else {
            setExpenses([]);
            setLoading(false);
        }
    }, [user, filters]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    const addExpense = async (expenseData) => {
        if (user) {
            try {
                const newExpense = await firestoreService.addData('expenses', { uid: user.uid, data: expenseData });
                setExpenses(prev => [newExpense, ...prev]);
                toast.success('Expense added successfully');
                return newExpense;
            } catch (err) {
                console.error('Failed to add expense:', err);
                toast.error(err.message || 'Failed to add expense');
                throw err;
            }
        }
    };

    const deleteExpense = async (id) => {
        if (user) {
            try {
                await firestoreService.deleteData('expenses', { uid: user.uid, id });
                setExpenses(prev => prev.filter(e => e.id !== id));
                toast.success('Expense deleted successfully');
            } catch (err) {
                console.error('Failed to delete expense:', err);
                toast.error(err.message || 'Failed to delete expense');
                throw err;
            }
        }
    };

    const updateExpense = async (id, updatedData) => {
        if (user) {
            try {
                await firestoreService.updateData('expenses', { uid: user.uid, id, data: updatedData });
                setExpenses(prev =>
                    prev.map(e =>
                        e.id === id ? { ...e, ...updatedData } : e
                    )
                );
                toast.success('Expense updated successfully');
                return { id, ...updatedData };
            } catch (err) {
                console.error('Failed to update expense:', err);
                toast.error(err.message || 'Failed to update expense');
                throw err;
            }
        }
    };
    
    const getTotalByCategory = () => {
        const totals = {};
        expenses.forEach(expense => {
            if(totals[expense.category]){
                totals[expense.category] += expense.amount;
            } else {
                totals[expense.category] = expense.amount;
            }
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
                filters,
                setFilters,
                addExpense,
                deleteExpense,
                updateExpense,
                getTotalByCategory,
                getMonthlyTotal,
                getMonthlyTrend,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
}
