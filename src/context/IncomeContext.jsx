import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db as firestore } from '@/config/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const IncomeContext = createContext();

export const useIncome = () => useContext(IncomeContext);

export const IncomeProvider = ({ children }) => {
    const [income, setIncome] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchIncome = useCallback(async () => {
        if (user) {
            try {
                const querySnapshot = await getDocs(collection(firestore, `users/${user.uid}/income`));
                const incomeData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setIncome(incomeData);
            } catch (error) {
                console.error("Error fetching income: ", error);
            }
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchIncome();
    }, [fetchIncome]);

    const addIncome = async (incomeData) => {
        if (user) {
            const newIncome = { ...incomeData, userId: user.uid };
            const docRef = await addDoc(collection(firestore, `users/${user.uid}/income`), newIncome);
            setIncome(prev => [...prev, { id: docRef.id, ...newIncome }]);
        }
    };

    const updateIncome = async (id, updatedData) => {
        if (user) {
            const docRef = doc(firestore, `users/${user.uid}/income`, id);
            await updateDoc(docRef, updatedData);
            setIncome(prev => prev.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
        }
    };

    const deleteIncome = async (id) => {
        if (user) {
            const docRef = doc(firestore, `users/${user.uid}/income`, id);
            await deleteDoc(docRef);
            setIncome(prev => prev.filter(item => item.id !== id));
        }
    };

    return (
        <IncomeContext.Provider value={{ income, loading, addIncome, updateIncome, deleteIncome }}>
            {children}
        </IncomeContext.Provider>
    );
};
