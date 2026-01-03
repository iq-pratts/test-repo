import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db as firestore } from '@/config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const GoalContext = createContext();

export const useGoals = () => useContext(GoalContext);

export const GoalProvider = ({ children }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchGoals = useCallback(async () => {
        if (user) {
            try {
                const querySnapshot = await getDocs(collection(firestore, `users/${user.uid}/goals`));
                const goalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGoals(goalsData);
            } catch (error) {
                console.error("Error fetching goals: ", error);
            }
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const addGoal = async (goalData) => {
        if (user) {
            const newGoal = { ...goalData, userId: user.uid, currentAmount: 0 };
            const docRef = await addDoc(collection(firestore, `users/${user.uid}/goals`), newGoal);
            setGoals(prev => [...prev, { id: docRef.id, ...newGoal }]);
        }
    };

    const updateGoal = async (id, updatedData) => {
        if (user) {
            const docRef = doc(firestore, `users/${user.uid}/goals`, id);
            await updateDoc(docRef, updatedData);
            setGoals(prev => prev.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
        }
    };

    const deleteGoal = async (id) => {
        if (user) {
            const docRef = doc(firestore, `users/${user.uid}/goals`, id);
            await deleteDoc(docRef);
            setGoals(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <GoalContext.Provider value={{ goals, loading, addGoal, updateGoal, deleteGoal }}>
            {children}
        </GoalContext.Provider>
    );
};
