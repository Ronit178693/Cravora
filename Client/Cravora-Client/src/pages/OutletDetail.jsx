// useMemo used to store a perticular value so it does not recomputes on every render
import React, { useState, useEffect, useMemo } from 'react';
// useParams for accessing dynamic valuse from the URL like /outlet/:id
import { useParams, Link } from 'react-router-dom';
import { getOutletById } from '../api/outletApi';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import MenuItemCard from '../components/MenuItemCard';
import ViewCheckoutButton from '../components/ViewCheckoutButton';
import './StudentDashboard.css';

const OutletDetail = () => {

    const { id } = useParams();
    const [outlet, setOutlet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    // Fetching outlet every time the outlet changes
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

    // Group menu items by category
    const categorizedMenu = useMemo(() => {
        // If the outlet has no menu items, return an empty object
        if (!outlet?.menu?.length) return {};
        const groups = {};
        // Looping throught the item category and grouping them
        outlet.menu.forEach(item => {
            const cat = item.category || 'Other';
            // If the category does not exist, create it
            if (!groups[cat]) groups[cat] = [];
            // Pushing the item to the category
            groups[cat].push(item);
        });
        return groups;
        // The dependency array ensures this runs only when the outlet changes
    }, [outlet]);

    // Get the list of categories
    const categories = Object.keys(categorizedMenu);

    // Set default active category once loaded
    useEffect(() => {
        // If the categories array has items and the active category is not set, set the first category as active
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories]);

    const getHeroImage = () => {
        if (!outlet?.images?.length) return null;
        const img = outlet.images[0];
        if (img.startsWith('http')) return img;
        return `http://localhost:5000/${img.replace(/\\/g, '/')}`;
    };

    const scrollToCategory = (cat) => {
        setActiveCategory(cat);
        const el = document.getElementById(`category-${cat.replace(/\s+/g, '-')}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (loading) {
        return (
            <div className="sd-page">
                <Navbar />
                <div className="sd-container"><div className="sd-loading">Loading outlet...</div></div>
            </div>
        );
    }

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

                {/* Hero */}
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

                {/* Menu Section */}
                {!outlet.menu || outlet.menu.length === 0 ? (
                    <div className="sd-empty">
                        <h3>No menu items yet</h3>
                        <p>This outlet hasn't added any items to their menu.</p>
                    </div>
                ) : (
                    <>
                        {/* Category Tabs */}
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

                        {/* Category Sections */}
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
            <ViewCheckoutButton />
        </div>
    );
};

export default OutletDetail;
