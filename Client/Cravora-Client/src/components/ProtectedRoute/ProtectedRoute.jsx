import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * ProtectedRoute Component
 * Route wrapper that restricts access based on authentication status and user roles.
 * 
 * @param {ReactNode} children - Component(s) to render if access is authorized
 * @param {String[]} roles - Array of user roles allowed to access this route (e.g., ['Student', 'Runner'])
 */
const ProtectedRoute = ({ children, roles }) => {
    const { user, isCheckingSession } = useAuth();
    
    // If still verifying the initial session, show a loading screen
    if (isCheckingSession) {
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
