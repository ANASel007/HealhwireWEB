import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from '@/lib/axios';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/utils/localStorage';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mfaRequired, setMfaRequired] = useState(false);
    const [tempToken, setTempToken] = useState(null);
    const [tempUserId, setTempUserId] = useState(null);
    const [tempUserType, setTempUserType] = useState(null);

    const router = useRouter();

    // Check if the token is expired
    const isTokenExpired = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };

    // Load user from localStorage on mount
    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = getStorageItem('user');

            if (token && storedUser && !isTokenExpired(token)) {
                setUser(storedUser);
            } else {
                removeStorageItem('token');
                removeStorageItem('user');
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Login a user (doctor or client)
    const login = useCallback(async (email, password, userType) => {
        setError(null);
        try {
            const response = await axios.post(`/auth/basic/login/${userType}`, {
                email,
                password,
            });

            // Handle successful login
            const { token, [userType]: userData } = response.data;
            localStorage.setItem('token', token);
            setStorageItem('user', { ...userData, role: userType });
            setUser({ ...userData, role: userType });

            return { success: true };
        } catch (error) {
            // Check if MFA is required
            if (error.response && error.response.data.mfaRequired) {
                setMfaRequired(true);
                setTempToken(error.response.data.tempToken);
                setTempUserId(error.response.data.userId);
                setTempUserType(error.response.data.userType);
                return { success: false, mfaRequired: true };
            }

            setError(
                error.response?.data?.message ||
                'An error occurred during login. Please try again.'
            );
            return { success: false, error: error.response?.data?.message };
        }
    }, []);

    // Enhanced login with MFA support
    const enhancedLogin = useCallback(async (email, password, userType) => {
        setError(null);
        try {
            const response = await axios.post(`/auth/enhanced/login/${userType}`, {
                email,
                password,
            });

            // If MFA is required
            if (response.data.mfaRequired) {
                setMfaRequired(true);
                setTempToken(response.data.tempToken);
                setTempUserId(response.data.userId);
                setTempUserType(response.data.userType);
                return { success: false, mfaRequired: true };
            }

            // If MFA is not required, handle normal login
            const { token, [userType]: userData } = response.data;
            localStorage.setItem('token', token);
            setStorageItem('user', { ...userData, role: userType });
            setUser({ ...userData, role: userType });

            return { success: true };
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'An error occurred during login. Please try again.'
            );
            return { success: false, error: error.response?.data?.message };
        }
    }, []);

    // Verify MFA token
    const verifyMFA = useCallback(async (token) => {
        try {
            const response = await axios.post('/auth/enhanced/mfa/verify', {
                userId: tempUserId,
                userType: tempUserType,
                token,
                tempToken,
            });

            // Handle successful verification
            const { token: authToken, user: userData } = response.data;
            localStorage.setItem('token', authToken);
            setStorageItem('user', userData);
            setUser(userData);

            // Reset MFA state
            setMfaRequired(false);
            setTempToken(null);
            setTempUserId(null);
            setTempUserType(null);

            return { success: true };
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Invalid MFA code. Please try again.'
            );
            return { success: false, error: error.response?.data?.message };
        }
    }, [tempUserId, tempUserType, tempToken]);

    // Register a new user (doctor or client)
    const register = useCallback(async (userData, userType) => {
        setError(null);
        try {
            const response = await axios.post(`/auth/basic/register/${userType}`, userData);

            // Handle successful registration
            const { token, [userType]: newUserData } = response.data;
            localStorage.setItem('token', token);
            setStorageItem('user', { ...newUserData, role: userType });
            setUser({ ...newUserData, role: userType });

            return { success: true };
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'An error occurred during registration. Please try again.'
            );
            return { success: false, error: error.response?.data?.message };
        }
    }, []);

    // Logout the current user
    const logout = useCallback(() => {
        removeStorageItem('token');
        removeStorageItem('user');
        setUser(null);
        router.push('/login');
    }, [router]);

    // Get current user profile
    const getCurrentUser = useCallback(async () => {
        try {
            const response = await axios.get('/auth/basic/user');
            setStorageItem('user', response.data);
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching current user:', error);
            if (error.response?.status === 401) {
                logout();
            }
            return null;
        }
    }, [logout]);

    // Check if user is authenticated
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated,
                login,
                enhancedLogin,
                register,
                logout,
                getCurrentUser,
                mfaRequired,
                verifyMFA,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
