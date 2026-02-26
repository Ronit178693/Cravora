import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * ProtectedRoute — wraps pages that require authentication.
 * - If still checking auth, shows a loading spinner.
 * - If not authenticated, redirects to /login.
 * - If `roles` is provided, checks the user's role; redirects to / if unauthorized.
 */
// Gets the role from the user and checks if it is authorized to access the page
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                height: '100vh', background: '#0a0a0f', color: '#fff',
                fontFamily: "'Inter', sans-serif", fontSize: '1rem'
            }}>
                Loading...
            </div>
        );
    }

    // If the user is not logged in, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If the user is logged in but not authorized, redirect to the home page
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
