import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firestoreService } from '@/services/firestoreService';
import { useAuth } from './AuthContext';

const IncomeContext = createContext();

export const useIncome = () => useContext(IncomeContext);

export const IncomeProvider = ({ children }) => {
    const [income, setIncome] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const { user } = useAuth();

    const fetchIncome = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const incomeData = await firestoreService.fetchData('income', { uid: user.uid, filters });
                setIncome(incomeData);
            } catch (error) {
                console.error("Error fetching income: ", error);
            }
            setLoading(false);
        }
    }, [user, filters]);

    useEffect(() => {
        fetchIncome();
    }, [fetchIncome]);

    const addIncome = async (incomeData) => {
        if (user) {
            const newIncome = await firestoreService.addData('income', { uid: user.uid, data: incomeData });
            setIncome(prev => [newIncome, ...prev]);
        }
    };

    const updateIncome = async (id, updatedData) => {
        if (user) {
            await firestoreService.updateData('income', { uid: user.uid, id, data: updatedData });
            setIncome(prev => prev.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
        }
    };

    const deleteIncome = async (id) => {
        if (user) {
            await firestoreService.deleteData('income', { uid: user.uid, id });
            setIncome(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <IncomeContext.Provider value={{ income, loading, addIncome, updateIncome, deleteIncome, filters, setFilters }}>
            {children}
        </IncomeContext.Provider>
    );
};
