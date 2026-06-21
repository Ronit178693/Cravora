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
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');

    useEffect(() => {
        fetchOrders();
    }, []);

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

    // Filter orders by active tab
    const filteredOrders = orders.filter(order => {
        switch (activeTab) {
            case 'pending': return order.status === 'Pending';
            case 'accepted': return ['Accepted', 'Preparing'].includes(order.status);
            case 'active': return ['OutForDelivery'].includes(order.status);
            case 'completed': return ['Delivered', 'Cancelled'].includes(order.status);
            default: return true;
        }
    });

    // Count orders per tab
    const counts = {
        pending: orders.filter(o => o.status === 'Pending').length,
        accepted: orders.filter(o => ['Accepted', 'Preparing'].includes(o.status)).length,
        completed: orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status)).length,
    };

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

    const getStatusBadgeClass = (status) => {
        return status.toLowerCase().replace(/\s+/g, '');
    };

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

                    {/* OrderTabs Sub-Component */}
                    <OrderTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        counts={counts}
                    />

                    {/* Orders List */}
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
