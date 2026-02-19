import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Store, UtensilsCrossed, Package, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

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
