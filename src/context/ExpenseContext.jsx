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
        }
    }, [user, filters]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    const addExpense = async (expenseData) => {
        if (user) {
            const newExpense = await firestoreService.addData('expenses', { uid: user.uid, data: expenseData });
            setExpenses(prev => [newExpense, ...prev]);
            toast.success('Expense added successfully');
        }
    };

    const deleteExpense = async (id) => {
        if (user) {
            await firestoreService.deleteData('expenses', { uid: user.uid, id });
            setExpenses(prev => prev.filter(e => e.id !== id));
            toast.success('Expense deleted successfully');
        }
    };

    const updateExpense = async (id, updatedData) => {
        if (user) {
            const returnedUpdatedData = await firestoreService.updateData('expenses', { uid: user.uid, id, data: updatedData });
            setExpenses(prev =>
                prev.map(e =>
                    e.id === id ? { ...e, ...returnedUpdatedData } : e
                )
            );
            toast.success('Expense updated successfully');
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
    
    const getMonthlyTotal = useCallback(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        if (!expenses) return 0;

        return expenses
            .filter(item => {
                if (!item.date) return false;

                const itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
                
                if (isNaN(itemDate.getTime())) return false;

                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            })
            .reduce((total, item) => total + item.amount, 0);
    }, [expenses]);

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
