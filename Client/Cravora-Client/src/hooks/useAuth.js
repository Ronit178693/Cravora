import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
    const context = useContext(AuthContext);
    // When using the hook inside a component that is not wrapped inside the <AuthProvider>
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
