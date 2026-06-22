import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllOutlets } from '../../api/outletApi';
import { getMyOrders, getMyOrderDeliveries } from '../../api/orderApi';
import { getMyDeliveries, getMyPackages } from '../../api/packageApi';
import useAuth from '../../hooks/useAuth';
import { Search, ChevronDown, Truck, Package, X, User, LogOut, ShoppingBag, Clock } from 'lucide-react';
import '../../pages/Home/Home.css';

/**
 * Navbar Component
 * Renders the global navigation header with search capabilities, links to runner/parcel panels,
 * and a profile drawer showcasing recent order history, delivery histories, and user roles.
 */
const Navbar = () => {

    // Authentication & Navigation hooks
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Scroll state - toggles styling when the user scrolls past a threshold
    const [scrolled, setScrolled] = useState(false);

    // Dropdown visibility state for the 'More' options (Runner Dashboard, Order Parcel)
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Profile drawer toggle state
    const [profileOpen, setProfileOpen] = useState(false);

    // User's order list & associated loading indicator for the profile drawer
    const [orderHistory, setOrderHistory] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // User's active or previous delivery history (for package or food runners)
    const [deliveryHistory, setDeliveryHistory] = useState([]);
    const [deliveriesLoading, setDeliveriesLoading] = useState(false);

    // Toggle for the mobile navigation drawer menu
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Global outlet/item search query and computed search matches
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchFocused, setSearchFocused] = useState(false);

    // Complete list of outlets fetched from the backend (used to perform local searching)
    const [allOutlets, setAllOutlets] = useState([]);

    // DOM references for closing dropdowns/drawers when clicking outside
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const profileRef = useRef(null);

    /**
     * Effect Hook - Scroll Listener
     * Triggers a state update when the user scrolls down more than 50 pixels,
     * allowing CSS styles to add background blur/shadow.
     */
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        // Cleanup event listener on unmount to prevent memory leaks
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    /**
     * Effect Hook - Outlet Loader
     * Fetches all registered outlets on initial mount to populate the local search index.
     */
    useEffect(() => {
        const loadOutlets = async () => {
            try {
                const res = await getAllOutlets();
                setAllOutlets(res.data.outlets || []);
            } catch (err) {
                console.error("Failed to load outlets for navbar search context:", err);
            }
        };
        loadOutlets();
    }, []);

    /**
     * Effect Hook - Profile Panel Stats Loader
     * Lazily fetches the current user's order and delivery history lists
     * only when the profile dropdown/panel is opened.
     */
    useEffect(() => {
        if (profileOpen) {
            const loadOrders = async () => {
                setOrdersLoading(true);
                try {
                    const [ordersRes, packagesRes] = await Promise.all([
                        getMyOrders(),
                        getMyPackages()
                    ]);
                    const orders = (ordersRes.data.orders || []).map(o => ({ ...o, _type: 'order' }));
                    const packages = (packagesRes.data.packages || []).map(p => ({ ...p, _type: 'package' }));
                    const combined = [...orders, ...packages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrderHistory(combined);
                } catch (err) {
                    console.error("Failed to fetch order history for profile panel:", err);
                } finally {
                    setOrdersLoading(false);
                }
            };
            const loadDeliveries = async () => {
                setDeliveriesLoading(true);
                try {
                    const [foodRes, pkgRes] = await Promise.all([
                        getMyOrderDeliveries(),
                        getMyDeliveries()
                    ]);
                    const foodDeliveries = (foodRes.data.orders || foodRes.data.deliveries || []).map(d => ({ ...d, _type: 'order' }));
                    const pkgDeliveries = (pkgRes.data.packages || pkgRes.data.deliveries || []).map(d => ({ ...d, _type: 'package' }));
                    const combined = [...foodDeliveries, ...pkgDeliveries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setDeliveryHistory(combined);
                } catch (err) {
                    console.error("Failed to fetch delivery history for profile panel:", err);
                } finally {
                    setDeliveriesLoading(false);
                }
            };
            loadOrders();
            loadDeliveries();
        }
    }, [profileOpen]);

    /**
     * Effect Hook - Click Outside Handler
     * Listens for clicks outside dropdown menus or panels to automatically close them.
     */
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Close the 'More' dropdown if user clicks outside of it
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            // Defocus search results if user clicks elsewhere
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSearchFocused(false);
            }
            // Close profile panel if user clicks outside of the panel
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        
        // Remove event listener on unmount
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /**
     * Effect Hook - Search Filter Logic
     * Performs a local fuzzy search over the cached `allOutlets` list,
     * matching either the outlet's name or its menu items' names/categories.
     */
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const q = searchQuery.toLowerCase();
        const results = [];
        
        allOutlets.forEach(outlet => {
            // Check if search term matches the outlet name
            if (outlet.name?.toLowerCase().includes(q)) {
                results.push({ 
                    type: 'outlet', 
                    id: outlet._id, 
                    name: outlet.name, 
                    sub: outlet.location || '' 
                });
            }
            // Check if search term matches any items inside the outlet's menu
            outlet.menu?.forEach(item => {
                if (item.name?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q)) {
                    results.push({
                        type: 'item',
                        id: outlet._id,
                        name: item.name,
                        sub: `${outlet.name} · ₹${item.price}`,
                    });
                }
            });
        });

        // Cap search results at 8 items to prevent UI overflow
        setSearchResults(results.slice(0, 8));
    }, [searchQuery, allOutlets]);

    /**
     * handleLogout
     * Triggers the logout API, clears current auth profile state, and redirects user to Login page.
     * @returns {Promise<void>}
     */
    const handleLogout = async () => {
        try {
            await logout();
            setProfileOpen(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout process encountered an error:", error);
        }
    };

    /**
     * handleSearchSelect
     * Navigates to the selected outlet detail page, clearing search input and focus.
     * @param {Object} result - The selected search option object
     */
    const handleSearchSelect = (result) => {
        navigate(`/outlet/${result.id}`);
        setSearchQuery('');
        setSearchFocused(false);
    };

    /**
     * getInitials
     * Computes the first letters of user's name to render as an avatar.
     * @returns {String} Up to two uppercase characters or '?' if name is missing
     */
    const getInitials = () => {
        if (!user?.name) return '?';
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    /**
     * formatDate
     * Helper to format a ISO date string to a localized Indian representation (e.g., 21 Jun 2026).
     * @param {String} date - ISO Date string
     * @returns {String} Formatted date string
     */
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    /**
     * getStatusColor
     * Determines color coding mapping for order and delivery status badges.
     * @param {String} status - Order/package status string
     * @returns {String} Hex code of corresponding theme color
     */
    const getStatusColor = (status) => {
        const colors = {
            Pending: '#f59e0b',
            Accepted: '#3b82f6',
            Preparing: '#8b5cf6',
            OutForDelivery: '#06b6d4',
            Delivered: '#22c55e',
            Cancelled: '#ef4444',
        };
        return colors[status] || '#6b7280';
    };

    return (
        <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="landing-container">
                <div className="nav-inner">
                    <Link to="/" className="nav-logo">
                        Cravora
                    </Link>

                    {/* Center — Search Bar */}
                    <div className="nav-search-wrapper" ref={searchRef}>
                        <div className={`nav-search ${searchFocused ? 'focused' : ''}`}>
                            <Search size={16} className="nav-search-icon" />
                            <input
                                type="text"
                                placeholder="Search outlets or items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                // When the search bar is focused, set searchFocused to true
                                onFocus={() => setSearchFocused(true)}
                            />
                            {/* If searching then show the cancel button which sets search query to empty */}
                            {searchQuery && (
                                <button className="nav-search-clear" onClick={() => setSearchQuery('')}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Search Dropdown */}
                        {searchFocused && searchResults.length > 0 && (
                            <div className="nav-search-dropdown">
                                {searchResults.map((r, i) => (
                                    <button
                                        key={i}
                                        className="nav-search-result"
                                        onClick={() => handleSearchSelect(r)}
                                    >
                                        <span className="nav-search-result-type">
                                            {r.type === 'outlet' ? '🏪' : '🍽️'}
                                        </span>
                                        <div>
                                            <div className="nav-search-result-name">{r.name}</div>
                                            <div className="nav-search-result-sub">{r.sub}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Shows no result found when search is focused and there are no results */}
                        {searchFocused && searchQuery && searchResults.length === 0 && (
                            <div className="nav-search-dropdown">
                                <div className="nav-search-empty">No results found</div>
                            </div>
                        )}
                    </div>

                    {/* Right — Nav Links */}
                    <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/student-dashboard">Dashboard</Link></li>

                        {/* More Dropdown */}
                        <li className="nav-dropdown-wrapper" ref={dropdownRef}>
                            <button
                                className="nav-dropdown-trigger"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                More <ChevronDown size={14} className={`nav-chevron ${dropdownOpen ? 'open' : ''}`} />
                            </button>

                            {dropdownOpen && (
                                <div className="nav-dropdown-menu">
                                    <Link
                                        to="/runner-dashboard"
                                        className="nav-dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <Truck size={16} />
                                        Runner Dashboard
                                    </Link>
                                    <Link
                                        to="/order-parcel"
                                        className="nav-dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        <Package size={16} />
                                        Order Parcel
                                    </Link>
                                </div>
                            )}
                        </li>

                        {/* Profile Icon */}
                        <li className="nav-profile-wrapper" ref={profileRef}>
                            <button
                                className="nav-profile-trigger"
                                onClick={() => setProfileOpen(!profileOpen)}
                            >
                                <div className="nav-profile-avatar">
                                    {getInitials()}
                                </div>
                            </button>

                            {/* Profile Panel */}
                            {profileOpen && (
                                <div className="nav-profile-panel">
                                    {/* User Info Header */}
                                    <div className="nav-profile-header">
                                        <div className="nav-profile-avatar-lg">
                                            {getInitials()}
                                        </div>
                                        <div className="nav-profile-info">
                                            <h4>{user?.name || 'User'}</h4>
                                            <p>{user?.email || 'Not logged in'}</p>
                                            {user?.role && (
                                                <span className="nav-profile-role">{user.role}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="nav-profile-divider" />

                                    {/* Stats */}
                                    <div className="nav-profile-stats">
                                        <div className="nav-profile-stat">
                                            <Truck size={16} />
                                            <div>
                                                <span className="nav-stat-value">
                                                    {user?.deliveryStats?.deliveriesCompleted || 0}
                                                </span>
                                                <span className="nav-stat-label">Deliveries</span>
                                            </div>
                                        </div>
                                        <div className="nav-profile-stat">
                                            <ShoppingBag size={16} />
                                            <div>
                                                <span className="nav-stat-value">
                                                    {orderHistory.length}
                                                </span>
                                                <span className="nav-stat-label">Orders</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="nav-profile-divider" />

                                    {/* Deliveries Completed */}
                                    <div className="nav-profile-section-title">
                                        <Truck size={14} /> Recent Deliveries
                                    </div>

                                    <div className="nav-profile-orders">
                                        {deliveriesLoading ? (
                                            <div className="nav-profile-orders-loading">Loading...</div>
                                        ) : deliveryHistory.length === 0 ? (
                                            <div className="nav-profile-orders-empty">No deliveries yet</div>
                                        ) : (
                                            deliveryHistory.slice(0, 5).map((delivery) => (
                                                <div key={delivery._id} className="nav-profile-order-item">
                                                    <div className="nav-profile-order-top">
                                                        <span className="nav-profile-order-id">
                                                            {delivery._type === 'package' ? '📦' : '🍔'} #{delivery._id.slice(-6).toUpperCase()}
                                                        </span>
                                                        <span
                                                            className="nav-profile-order-status"
                                                            style={{ color: getStatusColor(delivery.status) }}
                                                        >
                                                            {delivery.status}
                                                        </span>
                                                    </div>
                                                    <div className="nav-profile-order-bottom">
                                                        <span>{delivery.dropLocation || delivery.description || '—'}</span>
                                                        <span>{formatDate(delivery.createdAt)}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="nav-profile-divider" />

                                    {/* Order History List */}
                                    <div className="nav-profile-section-title">
                                        <Clock size={14} /> Recent Orders
                                    </div>

                                    <div className="nav-profile-orders">
                                        {ordersLoading ? (
                                            <div className="nav-profile-orders-loading">Loading...</div>
                                        ) : orderHistory.length === 0 ? (
                                            <div className="nav-profile-orders-empty">No orders yet</div>
                                        ) : (
                                            orderHistory.slice(0, 5).map((order) => (
                                                <div key={order._id} className="nav-profile-order-item">
                                                    <div className="nav-profile-order-top">
                                                        <span className="nav-profile-order-id">
                                                            {order._type === 'package' ? '📦' : '🍽️'} #{order._id.slice(-6).toUpperCase()}
                                                        </span>
                                                        <span
                                                            className="nav-profile-order-status"
                                                            style={{ color: getStatusColor(order.status) }}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="nav-profile-order-bottom">
                                                        <span>
                                                            {order._type === 'package'
                                                                ? `Parcel (${order.type})`
                                                                : `${order.items?.length || 0} items`}
                                                        </span>
                                                        <span>
                                                            ₹{order._type === 'package'
                                                                ? order.deliveryFee?.toFixed(0)
                                                                : order.totalAmount?.toFixed(0) || '—'}
                                                        </span>
                                                        <span>{formatDate(order.createdAt)}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="nav-profile-divider" />

                                    {/* Logout */}
                                    <button className="nav-profile-logout" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    </ul>

                    {/* Mobile Hamburger */}
                    <button className="nav-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            <style>{`
                /* --- Navbar Search --- */
                .nav-search-wrapper {
                    position: relative;
                    flex: 1;
                    max-width: 420px;
                    margin: 0 24px;
                }

                .nav-search {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    transition: all 0.3s;
                }

                .nav-search.focused {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--accent);
                    box-shadow: 0 0 20px rgba(255, 107, 53, 0.1);
                }

                .nav-search-icon {
                    color: var(--text-muted);
                    flex-shrink: 0;
                }

                .nav-search input {
                    background: none;
                    border: none;
                    outline: none;
                    color: var(--text-primary);
                    font-size: 0.88rem;
                    font-family: var(--font-main);
                    width: 100%;
                }

                .nav-search input::placeholder {
                    color: var(--text-muted);
                }

                .nav-search-clear {
                    background: none;
                    border: none;
                    padding: 4px;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }

                .nav-search-clear:hover {
                    color: var(--text-primary);
                }

                .nav-search-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    right: 0;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 8px;
                    z-index: 100;
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                    animation: sdFadeUp 0.2s ease-out;
                    max-height: 360px;
                    overflow-y: auto;
                }

                .nav-search-result {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                    color: var(--text-primary);
                    font-family: var(--font-main);
                }

                .nav-search-result:hover {
                    background: rgba(255, 255, 255, 0.06);
                }

                .nav-search-result-type {
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                .nav-search-result-name {
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .nav-search-result-sub {
                    font-size: 0.78rem;
                    color: var(--text-muted);
                }

                .nav-search-empty {
                    text-align: center;
                    padding: 16px;
                    color: var(--text-muted);
                    font-size: 0.88rem;
                }

                /* --- Navbar Dropdown --- */
                .nav-dropdown-wrapper {
                    position: relative;
                }

                .nav-dropdown-trigger {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 0.95rem;
                    font-family: var(--font-main);
                    cursor: pointer;
                    padding: 8px 4px;
                    transition: color 0.2s;
                }

                .nav-dropdown-trigger:hover {
                    color: var(--text-primary);
                }

                .nav-chevron {
                    transition: transform 0.2s;
                }

                .nav-chevron.open {
                    transform: rotate(180deg);
                }

                .nav-dropdown-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    min-width: 220px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 8px;
                    z-index: 100;
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
                    animation: sdFadeUp 0.2s ease-out;
                }

                .nav-dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 14px;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    transition: all 0.2s;
                    text-decoration: none;
                }

                .nav-dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.06);
                    color: var(--text-primary);
                }

                .nav-dropdown-item svg {
                    color: var(--accent);
                }

                /* --- Profile Icon & Panel --- */
                .nav-profile-wrapper {
                    position: relative;
                }

                .nav-profile-trigger {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                }

                .nav-profile-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: var(--gradient-1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-display);
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: white;
                    transition: box-shadow 0.3s, transform 0.2s;
                }

                .nav-profile-trigger:hover .nav-profile-avatar {
                    box-shadow: 0 0 20px var(--accent-glow);
                    transform: scale(1.08);
                }

                .nav-profile-panel {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    width: 320px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 0;
                    z-index: 200;
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
                    animation: sdFadeUp 0.25s ease-out;
                    overflow: hidden;
                }

                .nav-profile-header {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                }

                .nav-profile-avatar-lg {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: var(--gradient-1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-display);
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    flex-shrink: 0;
                }

                .nav-profile-info h4 {
                    font-family: var(--font-display);
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }

                .nav-profile-info p {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                    margin: 2px 0 0;
                }

                .nav-profile-role {
                    display: inline-block;
                    margin-top: 6px;
                    padding: 2px 10px;
                    border-radius: 12px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    background: rgba(255, 107, 53, 0.15);
                    color: var(--accent);
                }

                .nav-profile-divider {
                    height: 1px;
                    background: var(--border);
                    margin: 0;
                }

                .nav-profile-stats {
                    display: flex;
                    padding: 14px 20px;
                    gap: 20px;
                }

                .nav-profile-stat {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }

                .nav-profile-stat svg {
                    color: var(--accent);
                    flex-shrink: 0;
                }

                .nav-profile-stat div {
                    display: flex;
                    flex-direction: column;
                }

                .nav-stat-value {
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                .nav-stat-label {
                    font-size: 0.72rem;
                    color: var(--text-muted);
                }

                .nav-profile-section-title {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 20px 6px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .nav-profile-section-title svg {
                    color: var(--accent);
                }

                .nav-profile-orders {
                    padding: 4px 12px 12px;
                    max-height: 200px;
                    overflow-y: auto;
                }

                .nav-profile-orders-loading,
                .nav-profile-orders-empty {
                    text-align: center;
                    padding: 16px;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }

                .nav-profile-order-item {
                    padding: 10px 10px;
                    border-radius: 10px;
                    transition: background 0.2s;
                    cursor: default;
                }

                .nav-profile-order-item:hover {
                    background: rgba(255, 255, 255, 0.04);
                }

                .nav-profile-order-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 3px;
                }

                .nav-profile-order-id {
                    font-family: var(--font-display);
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .nav-profile-order-status {
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .nav-profile-order-bottom {
                    display: flex;
                    gap: 12px;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .nav-profile-logout {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    width: 100%;
                    padding: 14px;
                    background: none;
                    border: none;
                    color: #ef4444;
                    font-family: var(--font-main);
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .nav-profile-logout:hover {
                    background: rgba(239, 68, 68, 0.08);
                }

                /* --- Mobile --- */
                @media (max-width: 768px) {
                    .nav-hamburger {
                        display: flex;
                    }
                    .nav-search-wrapper {
                        display: none;
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
                    .nav-dropdown-menu {
                        position: static;
                        box-shadow: none;
                        border: 1px solid var(--border);
                        margin-top: 8px;
                    }
                    .nav-profile-panel {
                        position: fixed;
                        top: auto;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        width: 100%;
                        border-radius: 16px 16px 0 0;
                        max-height: 80vh;
                        overflow-y: auto;
                    }
                }

                @keyframes sdFadeUp {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
