//  Context for sharing the three states all over the app

import { createContext, useState } from "react";
import { registerUser, loginUser, logoutUser } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await registerUser(formData);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser(formData);
            setUser(res.data.user);
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } catch (err) {
            const msg = err.response?.data?.message || "Logout failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
