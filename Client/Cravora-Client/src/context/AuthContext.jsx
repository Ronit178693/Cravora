//  Context for sharing the three states all over the app
import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser } from "../api/authApi";
import { getUser as fetchMe } from "../api/userApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);   // true until session check completes
    const [error, setError] = useState(null);

    // On mount: try to restore session from the HTTP-only cookie
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetchMe();
                if (!cancelled) setUser(res.data.user);
            } catch {
                // No valid session — stay logged out
            } finally {
                if (!cancelled) setLoading(false); 
            }
        })();
        return () => { cancelled = true; };
    }, []);

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
