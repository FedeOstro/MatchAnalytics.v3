import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUser } from '../../lib/fetchusers'; // Aquí llamamos a tu función de autenticación.

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (username, password) => {
        const isAuthenticated = await fetchUser(username, password);
        if (isAuthenticated) {
            setUser({ username }); 
        }
        return isAuthenticated;
    };
    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    const value = {
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
