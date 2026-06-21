/**
 * Delivery History Page Component
 * Allows delivery runners to browse records of their claimed and completed deliveries.
 * - Fetches food order deliveries and parcel packages deliveries in parallel.
 * - Merges and normalizes the datasets into a unified timeline sorted descending by date.
 * - Renders summary statistics (total deliveries, total earnings) and supports filtering.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrderDeliveries } from '../../api/orderApi';
import { getMyDeliveries } from '../../api/packageApi';
import { Truck, Package, ShoppingBag, Clock, CheckCircle, X, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import HistoryList from '../../components/RunnerDashboard/HistoryList';
import '../Dashboard/StudentDashboard.css';

const DeliveryHistory = () => {
    // Array containing normalized list of both food and package deliveries handled by this runner
    const [deliveries, setDeliveries] = useState([]);
    
    // Loader indicator flag
    const [loading, setLoading] = useState(true);
    
    // Status filter state ('All', 'Orders', or 'Packages')
    const [filter, setFilter] = useState('All'); // All, Orders, Packages

    // Fetch and merge logs on component mount
    useEffect(() => {
        (async () => {
            try {
                // Fetch runner delivery logs in parallel
                const [ordRes, pkgRes] = await Promise.all([
                    getMyOrderDeliveries(),
                    getMyDeliveries(),
                ]);

                // Normalize both collections to support unified rendering
                const orders = (ordRes.data.orders || []).map(o => ({
                    ...o, _type: 'order', // Tag to distinguish object type
                }));
                const packages = (pkgRes.data.packages || []).map(p => ({
                    ...p, _type: 'package', // Tag to distinguish object type
                }));

                // Merge collections and sort descending by creation date
                const all = [...orders, ...packages].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setDeliveries(all);
            } catch (err) {
                console.error('Failed to fetch delivery history:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filter list based on currently selected tab
    const filtered = filter === 'All'
        ? deliveries
        : filter === 'Orders'
            ? deliveries.filter(d => d._type === 'order')
            : deliveries.filter(d => d._type === 'package');

    /**
     * Resolves badge color indicators for UI highlight.
     */
    const getStatusColor = (status) => {
        const colors = {
            Pending: '#f59e0b', Accepted: '#3b82f6', Preparing: '#8b5cf6',
            OutForDelivery: '#06b6d4', PickedUp: '#06b6d4',
            Delivered: '#22c55e', Cancelled: '#ef4444',
        };
        return colors[status] || '#6b7280';
    };

    /**
     * Resolves status icon components dynamically.
     */
    const getStatusIcon = (status) => {
        if (status === 'Delivered') return <CheckCircle size={13} />;
        if (status === 'Cancelled') return <X size={13} />;
        if (['OutForDelivery', 'PickedUp'].includes(status)) return <Truck size={13} />;
        return <Clock size={13} />;
    };

    /**
     * Formats date object to Indian locales representation.
     */
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // Calculate sum statistics
    const totalDelivered = deliveries.filter(d => d.status === 'Delivered').length;
    const totalEarned = deliveries
        .filter(d => d.status === 'Delivered')
        .reduce((sum, d) => sum + (d.deliveryFee || 0), 0);

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                <div className="dh-back-row">
                    <Link to="/runner-dashboard" className="dh-back-btn">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                </div>

                <h1 className="sd-page-title">Delivery <span>History</span></h1>
                <p className="sd-page-subtitle">
                    Your complete record of past deliveries.
                </p>

                {/* Statistical Overview grid */}
                <div className="dh-stats-row">
                    <div className="dh-stat-card">
                        <span className="dh-stat-value">{totalDelivered}</span>
                        <span className="dh-stat-label">Deliveries Completed</span>
                    </div>
                    <div className="dh-stat-card">
                        <span className="dh-stat-value">₹{totalEarned}</span>
                        <span className="dh-stat-label">Total Earned</span>
                    </div>
                    <div className="dh-stat-card">
                        <span className="dh-stat-value">{deliveries.length}</span>
                        <span className="dh-stat-label">Total Accepted</span>
                    </div>
                </div>

                {/* Filter Selector tabs */}
                <div className="dh-filter-tabs">
                    {['All', 'Orders', 'Packages'].map(f => (
                        <button
                            key={f}
                            className={`dh-filter-tab ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'Orders' && <ShoppingBag size={13} />}
                            {f === 'Packages' && <Package size={13} />}
                            {f} {f === 'All' ? `(${deliveries.length})` : f === 'Orders' ? `(${deliveries.filter(d => d._type === 'order').length})` : `(${deliveries.filter(d => d._type === 'package').length})`}
                        </button>
                    ))}
                </div>

                {/* Loading state or unified listing component */}
                {loading ? (
                    <div className="sd-loading">Loading history...</div>
                ) : filtered.length === 0 ? (
                    <div className="rd-empty">
                        <Truck size={40} />
                        <h3>No deliveries yet</h3>
                        <p>Accept deliveries from the runner dashboard to see your history here.</p>
                    </div>
                ) : (
                    /* Normalized list renderer */
                    <HistoryList
                        filtered={filtered}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                        getStatusIcon={getStatusIcon}
                    />
                )}
            </div>

            <style>{`
                .dh-back-row { margin-bottom: 20px; }
                .dh-back-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-secondary);
                    text-decoration: none;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: color 0.2s;
                }
                .dh-back-btn:hover { color: var(--accent); }

                /* Stats */
                .dh-stats-row {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 16px;
                    margin-bottom: 28px;
                }
                .dh-stat-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    text-align: center;
                }
                .dh-stat-value {
                    font-family: var(--font-display);
                    font-size: 1.8rem;
                    font-weight: 800;
                    background: var(--gradient-1);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .dh-stat-label {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                /* Filter tabs */
                .dh-filter-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    overflow-x: auto;
                }
                .dh-filter-tab {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 10px 20px;
                    border-radius: 50px;
                    border: 1px solid var(--border);
                    background: rgba(255,255,255,0.03);
                    color: var(--text-secondary);
                    font-family: var(--font-main);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.25s;
                }
                .dh-filter-tab:hover {
                    color: var(--text-primary);
                    border-color: rgba(255, 107, 53, 0.2);
                }
                .dh-filter-tab.active {
                    background: var(--gradient-1);
                    color: white;
                    border-color: transparent;
                    box-shadow: 0 4px 16px var(--accent-glow);
                }

                /* List */
                .dh-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .dh-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    padding: 18px 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    transition: var(--transition-smooth);
                    animation: sdFadeUp 0.35s ease-out both;
                }
                .dh-card:hover {
                    border-color: rgba(255, 107, 53, 0.15);
                }
                .dh-card-left {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex: 1;
                    min-width: 0;
                }
                .dh-card-type-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 10px;
                    border-radius: 14px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    width: fit-content;
                }
                .dh-card-route {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.88rem;
                    color: var(--text-secondary);
                    flex-wrap: wrap;
                }
                .dh-route-from, .dh-route-to {
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                .dh-route-from svg, .dh-route-to svg { color: var(--accent); }
                .dh-route-arrow { color: var(--text-muted); }
                .dh-items-summary {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                    font-size: 0.78rem;
                    color: var(--text-muted);
                }
                .dh-items-summary span {
                    padding: 1px 8px;
                    background: rgba(255,255,255,0.04);
                    border-radius: 8px;
                }
                .dh-card-date {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .dh-card-right {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 6px;
                    flex-shrink: 0;
                }
                .dh-card-status {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 0.82rem;
                    font-weight: 700;
                }
                .dh-card-fee {
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 0.95rem;
                    color: #22c55e;
                }

                /* Reuse from runner dashboard */
                .rd-empty {
                    text-align: center;
                    padding: 60px 20px;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                }
                .rd-empty svg { color: var(--text-muted); margin-bottom: 16px; }
                .rd-empty h3 {
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    font-weight: 700;
                    margin-bottom: 6px;
                }
                .rd-empty p { color: var(--text-muted); font-size: 0.9rem; }

                @media (max-width: 600px) {
                    .dh-card { flex-direction: column; align-items: flex-start; }
                    .dh-card-right { flex-direction: row; gap: 12px; }
                    .dh-stats-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default DeliveryHistory;
