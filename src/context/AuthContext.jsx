import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';
import { auth } from '@/config/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, displayName) => {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);

            if (displayName) {
                await updateProfile(result.user, {
                    displayName: displayName
                });
            }

            return result.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const login = async (email, password) => {
        try {
            setError(null);
            const result = await signInWithEmailAndPassword(auth, email, password);
            return result.user;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const resetPassword = async (email) => {
        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const verifyOldPassword = async (oldPassword) => {
        try {
            setError(null);
            if (!auth.currentUser || !auth.currentUser.email) {
                throw new Error('No user logged in');
            }

            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                oldPassword
            );

            await reauthenticateWithCredential(auth.currentUser, credential);
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateUserPassword = async (oldPassword, newPassword) => {
        try {
            setError(null);
            if (auth.currentUser) {
                // Verify old password first
                await verifyOldPassword(oldPassword);
                // Then update to new password
                await updatePassword(auth.currentUser, newPassword);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateUserProfile = async (updates) => {
        try {
            setError(null);
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, updates);
                setUser(auth.currentUser);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteAccount = async () => {
        try {
            setError(null);
            if (auth.currentUser) {
                await deleteUser(auth.currentUser);
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        resetPassword,
        verifyOldPassword,
        updateUserPassword,
        updateUserProfile,
        deleteAccount,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
