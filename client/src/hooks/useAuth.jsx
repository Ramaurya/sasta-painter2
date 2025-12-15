/**
 * useAuth.jsx
 * 
 * Authentication Context + Hook
 * - Provides global 'user' state via Context API.
 * - 'AuthProvider' wraps the app in App.jsx.
 * - 'useAuth' hook allows components to consume auth state.
 * - Handles: login state updates, logout, session check.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Ensure cookies are sent with requests
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user session on mount
    const refreshUser = async () => {
        try {
            const res = await axios.get('/api/check-auth');
            if (res.data.isAuthenticated && res.data.user) {
                setUser(res.data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    // Logout function
    const logout = async () => {
        try {
            await axios.get('/api/logout');
            setUser(null);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to consume Auth Context
const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
