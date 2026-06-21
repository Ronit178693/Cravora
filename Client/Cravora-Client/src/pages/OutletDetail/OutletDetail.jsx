/**
 * Outlet Detail Page Component
 * Displays a specific food outlet's profile details and groups its menu items by category.
 * Provides sticky category navigation buttons and scrolls to respective sections smoothly.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOutletById } from '../../api/outletApi';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { baseURL } from '../../utils/API_paths';
import MenuItemCard from '../../components/MenuItemCard/MenuItemCard';
import ViewCheckoutButton from '../../components/ViewCheckoutButton/ViewCheckoutButton';
import '../Dashboard/StudentDashboard.css';

const OutletDetail = () => {
    // Grab the dynamic outlet ID parameter from the URL path (/outlet/:id)
    const { id } = useParams();
    
    // Store detailed database payload for the current food outlet
    const [outlet, setOutlet] = useState(null);
    
    // UI loading spinner indicator state
    const [loading, setLoading] = useState(true);
    
    // Tracks the currently focused/scrolled category tab
    const [activeCategory, setActiveCategory] = useState(null);

    // Fetch specific outlet details on mount or ID change
    useEffect(() => {
        const fetchOutlet = async () => {
            try {
                const res = await getOutletById(id);
                setOutlet(res.data.outlet);
            } catch (err) {
                console.error('Error fetching outlet:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlet();
    }, [id]);

    /**
     * Groups menu items by their category key dynamically.
     * useMemo optimization prevents recalculating this grouping during simple state changes (e.g. active tab clicks).
     */
    const categorizedMenu = useMemo(() => {
        if (!outlet?.menu?.length) return {};
        const groups = {};
        outlet.menu.forEach(item => {
            const cat = item.category || 'Other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });
        return groups;
    }, [outlet]);

    // Gather array list of distinct menu categories
    const categories = Object.keys(categorizedMenu);

    // Set first available category as default active tab once loaded
    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories, activeCategory]);

    /**
     * Resolves the outlet's header background image URL.
     * @returns {String|null} Absolute URL to image asset or null if not set
     */
    const getHeroImage = () => {
        if (!outlet?.images?.length) return null;
        const img = outlet.images[0];
        if (img.startsWith('http')) return img;
        return `${baseURL}/${img.replace(/\\/g, '/')}`;
    };

    /**
     * Smoothly scrolls the window context to target category container.
     * @param {String} cat - Category name
     */
    const scrollToCategory = (cat) => {
        setActiveCategory(cat);
        const el = document.getElementById(`category-${cat.replace(/\s+/g, '-')}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Show loading spinner if network request is pending
    if (loading) {
        return (
            <div className="sd-page">
                <Navbar />
                <div className="sd-container"><div className="sd-loading">Loading outlet...</div></div>
            </div>
        );
    }

    // Handle case where API returns empty or database record is missing
    if (!outlet) {
        return (
            <div className="sd-page">
                <Navbar />
                <div className="sd-container">
                    <div className="sd-empty">
                        <h3>Outlet not found</h3>
                        <p>This outlet may have been removed.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                <Link to="/student-dashboard" className="sd-back-link">
                    <ArrowLeft size={16} /> Back to outlets
                </Link>

                {/* Cover Banner Hero block */}
                <div
                    className="sd-outlet-hero"
                    style={{
                        backgroundImage: getHeroImage()
                            ? `url(${getHeroImage()})`
                            : 'var(--gradient-2)',
                    }}
                >
                    <div className="sd-outlet-hero-overlay">
                        <h1>{outlet.name}</h1>
                        <p>{outlet.description}</p>
                        <div className="sd-outlet-info-row">
                            {outlet.location && (
                                <span className="sd-meta-item" style={{ color: 'var(--text-secondary)' }}>
                                    <MapPin size={14} /> {outlet.location}
                                </span>
                            )}
                            {outlet.WorkingHours && (
                                <span className="sd-meta-item" style={{ color: 'var(--text-secondary)' }}>
                                    <Clock size={14} /> {outlet.WorkingHours.open} – {outlet.WorkingHours.close}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu items list */}
                {!outlet.menu || outlet.menu.length === 0 ? (
                    <div className="sd-empty">
                        <h3>No menu items yet</h3>
                        <p>This outlet hasn't added any items to their menu.</p>
                    </div>
                ) : (
                    <>
                        {/* Interactive Category sticky scroll tabs */}
                        <div className="sd-category-tabs">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`sd-category-tab ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => scrollToCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Staggered lists of menu items categorized */}
                        {categories.map(cat => (
                            <div
                                key={cat}
                                id={`category-${cat.replace(/\s+/g, '-')}`}
                                className="sd-category-section"
                            >
                                <h3 className="sd-category-heading">{cat}</h3>
                                <div className="sd-category-grid">
                                    {categorizedMenu[cat].map((item, i) => (
                                        <MenuItemCard
                                            key={item._id}
                                            item={item}
                                            outletId={outlet._id}
                                            outletName={outlet.name}
                                            index={i}
                                         />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            {/* Sticky bottom checkout FAB trigger */}
            <ViewCheckoutButton />
        </div>
    );
};

export default OutletDetail;
