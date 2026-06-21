/**
 * OutletOrders Page Component
 * Renders the merchant-side orders dashboard where store owners view and progress customer orders.
 * - Fetches incoming orders destined for the merchant's outlet.
 * - Categorizes orders into filter tabs: 'pending', 'accepted', 'active', 'completed'.
 * - Integrates sub-components: OrderTabs, MerchantOrderCard.
 * - Handles order accept/cancel (reject) actions, and transitions order status (e.g. to "Preparing").
 */
import React, { useState, useEffect } from 'react';
import { getOutletOrders, acceptOrder, updateOrderStatus, cancelOrder } from '../../../api/orderApi.js';
import '../../Home/Home.css';
import '../ManageMenu/ManageMenu.css';
import Sidebar from '../../../components/Outlet/Sidebar';
import toast, { Toaster } from "react-hot-toast";
import { ChefHat, Clock, Package } from 'lucide-react';
import OrderTabs from '../../../components/OutletOrders/OrderTabs';
import MerchantOrderCard from '../../../components/OutletOrders/MerchantOrderCard';

const OutletOrders = () => {
    // Array containing all orders retrieved for this merchant's outlet
    const [orders, setOrders] = useState([]);
    
    // UI loader state trigger
    const [loading, setLoading] = useState(true);
    
    // Active filter tab: pending, accepted (Accepted/Preparing), active (OutForDelivery), completed (Delivered/Cancelled)
    const [activeTab, setActiveTab] = useState('pending');

    // Fetch orders list on mount
    useEffect(() => {
        fetchOrders();
    }, []);

    /**
     * Queries database for customer orders belonging to the merchant's outlet.
     */
    const fetchOrders = async () => {
        try {
            const response = await getOutletOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to fetch orders");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Merchant accepts a newly placed customer order.
     * Transitions order state from 'Pending' to 'Accepted'.
     * @param {String} orderId - Target order ID
     */
    const handleAccept = async (orderId) => {
        try {
            await acceptOrder(orderId);
            toast.success("Order accepted!");
            fetchOrders();
        } catch (error) {
            console.error("Error accepting order:", error);
            toast.error(error.response?.data?.message || "Failed to accept order");
        }
    };

    /**
     * Merchant rejects/cancels a customer order.
     * Triggers window confirm prompt before PUT API request.
     * @param {String} orderId - Target order ID
     */
    const handleReject = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await cancelOrder(orderId);
                toast.success("Order cancelled");
                fetchOrders();
            } catch (error) {
                console.error("Error cancelling order:", error);
                toast.error(error.response?.data?.message || "Failed to cancel order");
            }
        }
    };

    /**
     * Progresses an active order's lifecycle status.
     * @param {String} orderId - Order ID
     * @param {String} newStatus - Target status state
     */
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            toast.success(`Order status updated to ${newStatus}`);
            fetchOrders();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    // Filter order objects array according to the selected active tab value
    const filteredOrders = orders.filter(order => {
        switch (activeTab) {
            case 'pending': return order.status === 'Pending';
            case 'accepted': return ['Accepted', 'Preparing'].includes(order.status);
            case 'active': return ['OutForDelivery'].includes(order.status);
            case 'completed': return ['Delivered', 'Cancelled'].includes(order.status);
            default: return true;
        }
    });

    // Derive order count values dynamically to overlay counts on tab indicators
    const counts = {
        pending: orders.filter(o => o.status === 'Pending').length,
        accepted: orders.filter(o => ['Accepted', 'Preparing'].includes(o.status)).length,
        completed: orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)).length,
    };

    /**
     * Formats database date timestamp into human-readable relative time representation (e.g. "5m ago", "Just now").
     * @param {String} dateString - ISO Date format string
     */
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    /**
     * Resolves lowercase string class name for status indicator styling.
     */
    const getStatusBadgeClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '');
    };

    /**
     * Maps the next logical action required depending on order's current status state.
     */
    const getNextStatusAction = (order) => {
        switch (order.status) {
            case 'Accepted':
                return { label: 'Start Preparing', status: 'Preparing', icon: <ChefHat size={16} /> };
            default:
                return null;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Background Effects */}
            <div className="hero-bg" style={{ zIndex: -1, position: 'fixed' }}>
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="hero-grid"></div>
            </div>

            <Sidebar />

            <main className="dashboard-main dark-theme">
                <Toaster
                    position="top-center"
                    toastOptions={{
                        style: {
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                        },
                    }}
                />

                <div style={{ padding: '40px' }}>
                    {/* Header */}
                    <div className="dashboard-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px', marginBottom: '40px' }}>
                        <h1 className="section-title" style={{ fontSize: '2.5rem' }}>
                            Outlet <span style={{
                                background: 'var(--gradient-1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>Orders</span>
                        </h1>
                    </div>

                    {/* OrderTabs Sub-Component (Handles status tabs filtering clicks) */}
                    <OrderTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        counts={counts}
                    />

                    {/* Conditional list view render */}
                    {loading ? (
                        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '50px' }}>
                            Loading orders...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="empty-state">
                            <h3>No {activeTab} orders</h3>
                            <p>Orders will appear here when customers place them.</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.map((order, index) => (
                                /* Individual customer order card render */
                                <MerchantOrderCard
                                    key={order._id}
                                    order={order}
                                    index={index}
                                    getStatusBadgeClass={getStatusBadgeClass}
                                    formatTime={formatTime}
                                    getNextStatusAction={getNextStatusAction}
                                    handleAccept={handleAccept}
                                    handleReject={handleReject}
                                    handleStatusUpdate={handleStatusUpdate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OutletOrders;
