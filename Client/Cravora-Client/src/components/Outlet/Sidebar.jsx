import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Store, UtensilsCrossed, Package, LogOut } from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar Component
 * Left-side navigation bar for merchant/outlet dashboard pages.
 * Displays merchant profile details (avatar, name, email) and routes to Outlets,
 * Menu, Orders management, and a Logout action trigger.
 */
const Sidebar = () => {
    // Access context and helpers
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    /**
     * isActive
     * Checks if a navigation option is the active URL route.
     * @param {String} path - Target path string to verify
     * @returns {Boolean} True if matched
     */
    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to log out');
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-profile">
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="sidebar-avatar" />
                ) : (
                    <div className="sidebar-avatar-placeholder">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
                <div className="sidebar-name">{user?.name || 'Guest User'}</div>
                <div className="sidebar-email">{user?.email || 'guest@example.com'}</div>
            </div>

            <nav className="sidebar-nav">

                <Link to="/outlet-dashboard" className={`sidebar-link ${isActive('/outlet-dashboard') ? 'active' : ''}`}>
                    <Store className="sidebar-icon" size={20} />
                    My Outlets
                </Link>
                <Link to="/menu" className={`sidebar-link ${isActive('/menu') ? 'active' : ''}`}>
                    <UtensilsCrossed className="sidebar-icon" size={20} />
                    Menu
                </Link>
                <Link to="/orders" className={`sidebar-link ${isActive('/orders') ? 'active' : ''}`}>
                    <Package className="sidebar-icon" size={20} />
                    Orders
                </Link>
                {/* To add logout function and reviews feature with the orders */}
                <Link to="/login" className={`sidebar-link ${isActive('/login') ? 'active' : ''}`} onClick={handleLogout}>
                    <LogOut className="sidebar-icon" size={20} />
                    Logout
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
