import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom React Hook to retrieve Auth Context details.
 * Throws a descriptive error if context is accessed outside of the AuthProvider provider wrapper.
 * @returns {Object} { user, loading, isCheckingSession, error, register, login, logout }
 */
export default function useAuth() {
    const context = useContext(AuthContext);
    // Validate context exists to catch developer misuse early
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
