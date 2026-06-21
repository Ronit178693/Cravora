/**
 * Runner Dashboard Page Component
 * Allows students to operate as delivery runners.
 * - Fetches available unclaimed food orders and parcel requests in parallel.
 * - Displays active claimed deliveries (food order or parcel) with state transition workflows.
 * - Integrates sub-components: StatsBar, ActiveDelivery, and AvailableList.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { getAvailableOrders, acceptDelivery, updateOrderStatus, getMyOrderDeliveries } from '../../api/orderApi';
import { getAvailablePackages, acceptPackage, updatePackageStatus, getMyDeliveries } from '../../api/packageApi';
import Navbar from '../../components/Navbar/Navbar';
import StatsBar from '../../components/RunnerDashboard/StatsBar';
import ActiveDelivery from '../../components/RunnerDashboard/ActiveDelivery';
import AvailableList from '../../components/RunnerDashboard/AvailableList';
import '../Dashboard/StudentDashboard.css';

const RunnerDashboard = () => {
    // ── State Variables ──
    // List of available food orders ready for pickup
    const [availableOrders, setAvailableOrders] = useState([]);
    
    // List of available parcel requests ready for pickup
    const [availablePackages, setAvailablePackages] = useState([]);
    
    // Stores the runner's currently claimed active job (either a food order or parcel package)
    const [activeDelivery, setActiveDelivery] = useState(null);   // { type: 'order'|'package', data: {...} }
    
    // Master loading state spinner trigger
    const [loading, setLoading] = useState(true);
    
    // ID of the order/package currently undergoing the "Claim" API transition
    const [accepting, setAccepting] = useState(null);             // id being accepted
    
    // Flag to disable state progression buttons during status update requests
    const [updatingStatus, setUpdatingStatus] = useState(false);
    
    // Small loader flag for pulling manual refresh updates
    const [refreshing, setRefreshing] = useState(false);

    /**
     * Parallel fetches available orders, packages, and claims history.
     * Identifies if the runner has an active delivery session in progress.
     */
    const fetchAll = useCallback(async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            // Fetch multiple dependencies simultaneously
            const [ordRes, pkgRes, myOrdRes, myPkgRes] = await Promise.all([
                getAvailableOrders(),
                getAvailablePackages(),
                getMyOrderDeliveries(),
                getMyDeliveries(),
            ]);

            setAvailableOrders(ordRes.data.orders || []);
            setAvailablePackages(pkgRes.data.packages || []);

            // Identify active claimed order in delivery transit
            const activeOrder = (myOrdRes.data.orders || []).find(
                o => ['OutForDelivery'].includes(o.status)
            );
            // Identify active claimed package in delivery transit
            const activePkg = (myPkgRes.data.packages || []).find(
                p => ['Accepted', 'PickedUp'].includes(p.status)
            );

            // Set state to active delivery type
            if (activeOrder) {
                setActiveDelivery({ type: 'order', data: activeOrder });
            } else if (activePkg) {
                setActiveDelivery({ type: 'package', data: activePkg });
            } else {
                setActiveDelivery(null);
            }
        } catch (err) {
            console.error('Failed to fetch runner data:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial load on mount
    useEffect(() => { fetchAll(); }, [fetchAll]);

    /**
     * Claims a campus food order for delivery.
     * @param {String} orderId - Target order ID
     */
    const handleAcceptOrder = async (orderId) => {
        setAccepting(orderId);
        try {
            await acceptDelivery(orderId);
            await fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept delivery');
        } finally {
            setAccepting(null);
        }
    };

    /**
     * Claims a parcel/package request for delivery.
     * @param {String} pkgId - Target package ID
     */
    const handleAcceptPackage = async (pkgId) => {
        setAccepting(pkgId);
        try {
            await acceptPackage(pkgId);
            await fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to accept package');
        } finally {
            setAccepting(null);
        }
    };

    /**
     * Progresses delivery status (e.g. marking as PickedUp or Delivered).
     * @param {String} nextStatus - target state transition value
     */
    const handleStatusUpdate = async (nextStatus) => {
        if (!activeDelivery) return;
        setUpdatingStatus(true);
        try {
            if (activeDelivery.type === 'order') {
                await updateOrderStatus(activeDelivery.data._id, nextStatus);
            } else {
                await updatePackageStatus(activeDelivery.data._id, nextStatus);
            }
            await fetchAll();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    /**
     * Resolves status badge colors for visual highlights.
     * @param {String} status - delivery status string
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
     * Formats database timestamps to Indian standard date-time representations.
     */
    const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    /**
     * Resolves the next button prompt depending on current delivery status state.
     */
    const getNextAction = () => {
        if (!activeDelivery) return null;
        const { type, data } = activeDelivery;
        if (type === 'order') {
            if (data.status === 'OutForDelivery') return { label: 'Mark Delivered', status: 'Delivered' };
        } else {
            if (data.status === 'Accepted') return { label: 'Mark Picked Up', status: 'PickedUp' };
            if (data.status === 'PickedUp') return { label: 'Mark Delivered', status: 'Delivered' };
        }
        return null;
    };

    const hasActiveDelivery = !!activeDelivery;
    const nextAction = getNextAction();

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                {/* Stats Bar Sub-Component */}
                <StatsBar fetchAll={fetchAll} refreshing={refreshing} />

                {loading ? (
                    <div className="sd-loading">Loading deliveries...</div>
                ) : (
                    <div className="rd-layout">
                        {/* Active Delivery Sub-Component */}
                        <ActiveDelivery
                            activeDelivery={activeDelivery}
                            getStatusColor={getStatusColor}
                            nextAction={nextAction}
                            handleStatusUpdate={handleStatusUpdate}
                            updatingStatus={updatingStatus}
                        />

                        {/* Available Deliveries Sub-Component */}
                        <AvailableList
                            availableOrders={availableOrders}
                            availablePackages={availablePackages}
                            hasActiveDelivery={hasActiveDelivery}
                            accepting={accepting}
                            handleAcceptOrder={handleAcceptOrder}
                            handleAcceptPackage={handleAcceptPackage}
                            formatDate={formatDate}
                        />
                    </div>
                )}
            </div>

            <style>{`
                /* ===== Runner Dashboard ===== */
                .rd-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 8px;
                }
                .rd-header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .rd-refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 18px;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border);
                    background: rgba(255,255,255,0.03);
                    color: var(--text-secondary);
                    font-family: var(--font-main);
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.25s;
                }
                .rd-refresh-btn:hover { border-color: var(--accent); color: var(--accent); }
                .rd-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .spinning { animation: spin 0.8s linear infinite; }
                .rd-history-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 18px;
                    border-radius: var(--radius-sm);
                    background: var(--gradient-1);
                    color: white;
                    font-family: var(--font-display);
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.25s;
                }
                .rd-history-link:hover {
                    box-shadow: 0 4px 20px var(--accent-glow);
                    transform: translateY(-2px);
                }

                /* Layout */
                .rd-layout { display: flex; flex-direction: column; gap: 36px; }

                /* ── Active Delivery ── */
                .rd-active-section {
                    animation: sdFadeUp 0.4s ease-out both;
                }
                .rd-section-title {
                    font-family: var(--font-display);
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                }
                .rd-section-title svg { color: var(--accent); }
                .rd-section-title.active-pulse svg {
                    animation: pulse-glow 2s ease-in-out infinite;
                }
                @keyframes pulse-glow {
                    0%, 100% { filter: drop-shadow(0 0 4px var(--accent-glow)); }
                    50% { filter: drop-shadow(0 0 12px var(--accent-glow)); }
                }

                .rd-active-card {
                    background: var(--bg-card);
                    border: 1px solid var(--accent);
                    border-radius: var(--radius-lg);
                    padding: 28px;
                    box-shadow: 0 0 30px rgba(255, 107, 53, 0.08);
                }
                .rd-active-type-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .rd-active-status {
                    font-family: var(--font-display);
                    font-size: 1rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                }

                /* Route display */
                .rd-active-route {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    margin-bottom: 20px;
                }
                .rd-route-point {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                .rd-route-dot {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .rd-route-dot.pickup {
                    background: var(--accent);
                    box-shadow: 0 0 8px var(--accent-glow);
                }
                .rd-route-dot.drop {
                    background: #22c55e;
                    box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
                }
                .rd-route-label {
                    display: block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .rd-route-value {
                    display: block;
                    font-size: 0.95rem;
                    color: var(--text-primary);
                    font-weight: 600;
                }
                .rd-route-line {
                    width: 2px;
                    height: 24px;
                    background: var(--border);
                    margin-left: 6px;
                }

                /* Info grid */
                .rd-active-info-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-bottom: 20px;
                    padding-top: 16px;
                    border-top: 1px solid var(--border);
                }
                .rd-info-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.88rem;
                    color: var(--text-secondary);
                }
                .rd-info-item.full-width { width: 100%; }
                .rd-info-item svg { color: var(--accent); flex-shrink: 0; }
                .rd-info-item a {
                    color: var(--accent);
                    text-decoration: none;
                    font-weight: 600;
                }
                .rd-info-item a:hover { text-decoration: underline; }
                .rd-fee-badge {
                    padding: 3px 10px;
                    border-radius: 12px;
                    background: rgba(34, 197, 94, 0.15);
                    color: #22c55e;
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                /* Status update button */
                .rd-status-btn {
                    width: 100%;
                    padding: 14px;
                    border-radius: var(--radius-md);
                    background: var(--gradient-1);
                    color: white;
                    font-family: var(--font-display);
                    font-size: 1rem;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.25s;
                }
                .rd-status-btn:hover:not(:disabled) {
                    box-shadow: 0 4px 24px var(--accent-glow);
                    transform: translateY(-2px);
                }
                .rd-status-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                /* ── Busy Notice ── */
                .rd-busy-notice {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 18px;
                    border-radius: var(--radius-sm);
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.25);
                    color: #f59e0b;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                /* ── Available Cards Grid ── */
                .rd-cards-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 20px;
                }
                .rd-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    transition: var(--transition-smooth);
                    animation: sdFadeUp 0.4s ease-out both;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }
                .rd-card:hover {
                    border-color: rgba(255, 107, 53, 0.2);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
                    transform: translateY(-3px);
                }
                .rd-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .rd-card-type {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 3px 10px;
                    border-radius: 16px;
                    font-size: 0.72rem;
                    font-weight: 700;
                }
                .rd-card-type.order {
                    background: rgba(139, 92, 246, 0.15);
                    color: #8b5cf6;
                }
                .rd-card-type.package {
                    background: rgba(59, 130, 246, 0.15);
                    color: #3b82f6;
                }
                .rd-card-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                /* Route */
                .rd-card-route {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                .rd-card-route-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    line-height: 1.4;
                }
                .rd-card-route-row svg { color: var(--accent); flex-shrink: 0; margin-top: 2px; }
                .rd-card-route-arrow {
                    margin-left: 4px;
                    color: var(--text-muted);
                    font-size: 0.75rem;
                }

                /* Items */
                .rd-card-items {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
                .rd-item-tag {
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    background: rgba(255,255,255,0.05);
                    color: var(--text-secondary);
                    border: 1px solid var(--border);
                }
                .rd-item-tag.more {
                    background: rgba(255, 107, 53, 0.1);
                    color: var(--accent);
                    border-color: rgba(255, 107, 53, 0.2);
                }
                .rd-card-desc {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    line-height: 1.4;
                    margin: 0;
                }

                /* Footer */
                .rd-card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 12px;
                    border-top: 1px solid var(--border);
                    margin-top: auto;
                }
                .rd-card-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .rd-card-total {
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-primary);
                }
                .rd-card-fee {
                    padding: 2px 8px;
                    border-radius: 10px;
                    font-size: 0.72rem;
                    font-weight: 700;
                    background: rgba(34, 197, 94, 0.12);
                    color: #22c55e;
                }
                .rd-card-qty {
                    font-size: 0.82rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
                .rd-accept-btn {
                    padding: 10px 24px;
                    border-radius: var(--radius-sm);
                    background: var(--gradient-1);
                    color: white;
                    font-family: var(--font-display);
                    font-size: 0.85rem;
                    font-weight: 700;
                    border: none;
                    cursor: pointer;
                    transition: all 0.25s;
                }
                .rd-accept-btn:hover:not(:disabled) {
                    box-shadow: 0 4px 16px var(--accent-glow);
                    transform: translateY(-2px);
                }
                .rd-accept-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                /* ── Empty state ── */
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
                .rd-empty p {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .sd-loading {
                    text-align: center;
                    padding: 80px 20px;
                    color: var(--text-muted);
                    font-size: 1rem;
                }

                /* Responsive */
                @media (max-width: 700px) {
                    .rd-header { flex-direction: column; }
                    .rd-cards-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default RunnerDashboard;
