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
        const collectionRef = collection(db, `users/${uid}/${collectionName}`);
        let q;
        let clientSideFilters = {};

        if (filters && filters.category) {
            // If filtering by category, we can't also do a range filter on date in Firestore.
            // We'll do the date filtering on the client side.
            q = query(collectionRef, where('category', '==', filters.category), orderBy('date', 'asc'));
            if(filters.startDate) clientSideFilters.startDate = filters.startDate;
            if(filters.endDate) clientSideFilters.endDate = filters.endDate;
        } else {
            // No category filter, so we can do the date range filtering in Firestore.
            const constraints = [orderBy('date', 'asc')];
            if (filters && filters.startDate) {
                constraints.push(where('date', '>=', filters.startDate));
            }
            if (filters && filters.endDate) {
                constraints.push(where('date', '<=', filters.endDate));
            }
            q = query(collectionRef, ...constraints);
        }

        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Apply client-side filters
        if (clientSideFilters.startDate) {
            data = data.filter(item => item.date >= clientSideFilters.startDate);
        }
        if (clientSideFilters.endDate) {
            data = data.filter(item => item.date <= clientSideFilters.endDate);
        }
        
        if (filters && filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            data = data.filter(item => 
                (item.description && item.description.toLowerCase().includes(keyword)) ||
                (item.name && item.name.toLowerCase().includes(keyword)) ||
                (item.category && item.category.toLowerCase().includes(keyword))
            );
        }

        return data;
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
