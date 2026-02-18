import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../api/authApi';
import '../pages/Home.css'; // Ensure we have access to the styles

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null); // In a real app, use Context
    const navigate = useNavigate();
    const location = useLocation();

    // Mock checking auth state - replace with Context in production
    useEffect(() => {
        const checkAuth = () => {
            // For now, checks if we're on a dashboard route to assume logged in, 
            // or checks local storage/cookie existence if you have that logic set up.
            // This is a placeholder. 
            // IMPROVEMENT: Use the UserContext I explained earlier!
        };
        checkAuth();

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const toggleMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="landing-container">
                <div className="nav-inner">
                    <Link to="/" className="nav-logo">
                        Cravora
                    </Link>

                    {/* Desktop Menu */}
                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/">Home</Link></li>
                        {/* Conditional Links based on role/auth */}
                        <li><Link to="/outlet-dashboard">My Outlet</Link></li>
                        <li><Link to="/orders">Orders</Link></li>

                        {/* Call to Action / Profile */}
                        <li>
                            <button className="nav-cta" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>

                    {/* Mobile Hamburger */}
                    <button className="nav-hamburger" onClick={toggleMenu} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Styles Support */}
            <style>{`
                @media (max-width: 768px) {
                    .nav-hamburger {
                        display: flex;
                    }
                    .nav-links {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(10, 10, 15, 0.95);
                        backdrop-filter: blur(20px);
                        flex-direction: column;
                        padding: 20px;
                        gap: 20px;
                        clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
                        transition: clip-path 0.4s ease-in-out;
                    }
                    .nav-links.active {
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
