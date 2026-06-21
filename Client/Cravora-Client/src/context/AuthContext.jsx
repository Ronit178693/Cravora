/**
 * Authentication Context & Provider
 * Manages user login state, registration, session restoration, and errors globally.
 */
import { createContext, useState, useEffect } from "react";
import { registerUser, loginUser, logoutUser } from "../api/authApi";
import { getUser as fetchMe } from "../api/userApi";

// Create context object to be consumed by useAuth hook
export const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the entire app tree.
 * Restores and manages user sessions via HTTP-Only cookies.
 */
export function AuthProvider({ children }) {
    // Current authenticated user object (null if logged out)
    const [user, setUser] = useState(null);
    
    // Tracks loading state during async auth actions (Login, Register, Logout)
    const [loading, setLoading] = useState(false);
    
    // Tracks if session restore check is in progress on initial site load
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    
    // Stores error messages thrown by the server for form displays
    const [error, setError] = useState(null);

    // On component mount: attempt to fetch current user profile to restore session.
    // Utilizes JWT cookie automatically sent by the browser due to withCredentials.
    useEffect(() => {
        let cancelled = false; // Flag to prevent state updates if component unmounts
        (async () => {
            try {
                const res = await fetchMe();
                if (!cancelled) {
                    setUser(res.data.user); // Set authenticated user state
                }
            } catch {
                // No valid JWT cookie or server unreachable - keep user state as null (logged out)
            } finally {
                if (!cancelled) {
                    setIsCheckingSession(false); // Stop session loading spinner
                }
            }
        })();
        // Cleanup function resets the cancelled state flag
        return () => { cancelled = true; };
    }, []);

    /**
     * Sends registration payload to create a new user account.
     * @param {Object} formData - Name, email, password, phone, role.
     */
    const register = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await registerUser(formData);
            setUser(res.data.user); // Set state to newly created user
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Authenticates existing user credentials.
     * @param {Object} formData - Email, password.
     */
    const login = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser(formData);
            setUser(res.data.user); // Set state to authenticated user
            return res.data;
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Clears user session on the backend and resets client state.
     */
    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null); // Clear authenticated user state
        } catch (err) {
            const msg = err.response?.data?.message || "Logout failed";
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Provide the auth state values and actions globally to the application
        <AuthContext.Provider value={{ user, loading, isCheckingSession, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
