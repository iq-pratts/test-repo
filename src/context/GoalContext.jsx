import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firestoreService } from '@/services/firestoreService';
import { useAuth } from './AuthContext';

const GoalContext = createContext();

export const useGoals = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({});
    const { user } = useAuth();

    const fetchGoals = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const goalsData = await firestoreService.fetchData('goals', { uid: user.uid, filters });
                setGoals(goalsData);
            } catch (error) {
                console.error("Error fetching goals: ", error);
            }
            setLoading(false);
        }
    }, [user, filters]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const addGoal = async (goalData) => {
        if (user) {
            const newGoal = await firestoreService.addData('goals', { uid: user.uid, data: { ...goalData, currentAmount: 0 } });
            setGoals(prev => [newGoal, ...prev]);
        }
    };

    const updateGoal = async (id, updatedData) => {
        if (user) {
            await firestoreService.updateData('goals', { uid: user.uid, id, data: updatedData });
            setGoals(prev => prev.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
        }
    };

    const deleteGoal = async (id) => {
        if (user) {
            await firestoreService.deleteData('goals', { uid: user.uid, id });
            setGoals(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <GoalContext.Provider value={{ goals, loading, addGoal, updateGoal, deleteGoal, filters, setFilters }}>
            {children}
        </GoalContext.Provider>
    );
};
