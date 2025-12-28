import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        if (userInfo) {
            try {
                setUser(JSON.parse(userInfo));
            } catch (error) {
                console.error('Failed to parse user info from storage:', error);
                localStorage.removeItem('userInfo');
                sessionStorage.removeItem('userInfo');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password, remember = false, role = 'user') => {
        try {
            const { data } = await axios.post('/users/login', { email, password, role });
            setUser(data);

            if (remember) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('savedEmail', email);
            } else {
                sessionStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.removeItem('savedEmail');
            }

            return data;
        } catch (error) {
            const message = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : error.message;
            throw message;
        }
    };

    const register = async (name, email, password, phone, address) => {
        try {
            const { data } = await axios.post('/users', { name, email, password, phone, address });
            // Do not log in automatically
            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateProfile = async (user) => {
        // Placeholder for profile update
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
