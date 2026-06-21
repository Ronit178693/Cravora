import React, { useState, useEffect } from 'react';
import { getAllOutlets } from '../../api/outletApi';
import Navbar from '../../components/Navbar/Navbar';
import OutletCard from '../../components/OutletCard/OutletCard';
import ViewCheckoutButton from '../../components/ViewCheckoutButton/ViewCheckoutButton';
import './StudentDashboard.css';

const Dashboard = () => {
    const [outlets, setOutlets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const res = await getAllOutlets();
                const activeOutlets = (res.data.outlets || []).filter(o => o.isOpen !== false);
                setOutlets(activeOutlets);
            } catch (err) {
                console.error('Error fetching outlets:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOutlets();
    }, []);

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                <h1 className="sd-page-title">
                    Explore <span>Outlets</span>
                </h1>
                <p className="sd-page-subtitle">
                    Browse campus food outlets and order your favorites.
                </p>

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
                            <OutletCard key={outlet._id} outlet={outlet} index={i} />
                        ))}
                    </div>
                )}
            </div>
            <ViewCheckoutButton />
        </div>
    );
};

export default Dashboard;
