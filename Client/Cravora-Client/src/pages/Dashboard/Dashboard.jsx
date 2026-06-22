/**
 * Student Dashboard Page Component
 * Serves as the landing dashboard after student log-in.
 * Fetches all registered food outlets on campus and displays them in a card grid list.
 */
import React, { useState, useEffect } from 'react';
import { getAllOutlets } from '../../api/outletApi';
import Navbar from '../../components/Navbar/Navbar';
import OutletCard from '../../components/OutletCard/OutletCard';
import ViewCheckoutButton from '../../components/ViewCheckoutButton/ViewCheckoutButton';
import './StudentDashboard.css';

const Dashboard = () => {
    // Array storing list of outlets retrieved from the server
    const [outlets, setOutlets] = useState([]);
     
    // Loading indicator state 
    const [loading, setLoading] = useState(true);

    // On mount: fetch all outlets from the database
    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const res = await getAllOutlets();
                // Filter and store only outlets that are marked open (isOpen !== false)
                const activeOutlets = (res.data.outlets || []).filter(o => o.isOpen !== false);
                setOutlets(activeOutlets);
            } catch (err) {
                console.error('Error fetching outlets:', err);
            } finally {
                setLoading(false); // Stop loading indicator
            }
        };
        fetchOutlets();
    }, []);

    return (
        <div className="sd-page">
            {/* Main navigation header panel */}
            <Navbar />
            
            <div className="sd-container">
                <h1 className="sd-page-title">
                    Explore <span>Outlets</span>
                </h1>
                <p className="sd-page-subtitle">
                    Browse campus food outlets and order your favorites.
                </p>

                {/* Conditional Rendering: Loading, Empty, or Outlets Grid */}
                {loading ? (
                    <div className="sd-loading">Loading outlets...</div>
                ) : outlets.length === 0 ? (
                    <div className="sd-empty">
                        <h3>No outlets available</h3>
                        <p>Check back later for delicious food options!</p>
                    </div>
                ) : (
                    <div className="sd-outlets-grid">
                        {outlets.map((outlet, i) => (
                            // Render individual outlet cards with anim-stagger index
                            <OutletCard key={outlet._id} outlet={outlet} index={i} />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Sticky Floating Action Button (FAB) to check out if cart has items */}
            <ViewCheckoutButton />
        </div>
    );
};

export default Dashboard;
