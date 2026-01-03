import { db } from '@/config/firebase';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from 'firebase/firestore';

const fetchData = async (collectionName, { uid, filters }) => {
    try {
        let q = query(collection(db, `users/${uid}/${collectionName}`), orderBy('date', 'desc'));

        if (filters) {
            if (filters.keyword) {
                q = query(q, where('name', '>=', filters.keyword), where('name', '<=', filters.keyword + '\uf8ff'));
            }
            if (filters.category) {
                q = query(q, where('category', '==', filters.category));
            }
            if (filters.startDate) {
                q = query(q, where('date', '>=', filters.startDate));
            }
            if (filters.endDate) {
                q = query(q, where('date', '<=', filters.endDate));
            }
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching ${collectionName}: `, error);
        throw new Error(`Failed to fetch ${collectionName}.`);
    }
};

const addData = async (collectionName, { uid, data }) => {
    try {
        const docRef = await addDoc(collection(db, `users/${uid}/${collectionName}`), { ...data, userId: uid });
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error(`Error adding ${collectionName}: `, error);
        throw new Error(`Failed to add ${collectionName}.`);
    }
};

const updateData = async (collectionName, { uid, id, data }) => {
    try {
        const docRef = doc(db, `users/${uid}/${collectionName}`, id);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error(`Error updating ${collectionName}: `, error);
        throw new Error(`Failed to update ${collectionName}.`);
    }
};

const deleteData = async (collectionName, { uid, id }) => {
    try {
        const docRef = doc(db, `users/${uid}/${collectionName}`, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error(`Error deleting ${collectionName}: `, error);
        throw new Error(`Failed to delete ${collectionName}.`);
    }
};

export const firestoreService = {
    fetchData,
    addData,
    updateData,
    deleteData,
};
