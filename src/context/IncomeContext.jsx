import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firestoreService } from '@/services/firestoreService';
import { useAuth } from './AuthContext';

const IncomeContext = createContext();

export const useIncome = () => useContext(IncomeContext);

export const IncomeProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const { user } = useAuth();

    const fetchIncomes = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const incomeData = await firestoreService.fetchData('income', { uid: user.uid, filters });
                setIncomes(incomeData);
            } catch (error) {
                console.error("Error fetching income: ", error);
            }
            setLoading(false);
        }
    }, [user, filters]);

    useEffect(() => {
        fetchIncomes();
    }, [fetchIncomes]);

    const addIncome = async (incomeData) => {
        if (user) {
            const newIncome = await firestoreService.addData('income', { uid: user.uid, data: incomeData });
            setIncomes(prev => [newIncome, ...prev]);
        }
    };

    const updateIncome = async (id, updatedData) => {
        if (user) {
            const returnedUpdatedData = await firestoreService.updateData('income', { uid: user.uid, id, data: updatedData });
            setIncomes(prev => prev.map(item => (item.id === id ? { ...item, ...returnedUpdatedData } : item)));
        }
    };

    const deleteIncome = async (id) => {
        if (user) {
            await firestoreService.deleteData('income', { uid: user.uid, id });
            setIncomes(prev => prev.filter(item => item.id !== id));
        }
    };

    const getMonthlyTotal = useCallback(() => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        if (!incomes) return 0;
        return incomes
            .filter(item => {
                if (!item.date) return false;
                const itemDate = item.date.toDate ? item.date.toDate() : new Date(item.date);
                if (isNaN(itemDate.getTime())) return false; // Invalid date
                return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
            })
            .reduce((total, item) => total + item.amount, 0);
    }, [incomes]);

    return (
        <IncomeContext.Provider value={{ incomes, loading, addIncome, updateIncome, deleteIncome, filters, setFilters, getMonthlyTotal }}>
            {children}
        </IncomeContext.Provider>
    );
};