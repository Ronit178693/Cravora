import React, { useState, useEffect } from 'react';
import { getOutletOrders, acceptOrder, updateOrderStatus, cancelOrder } from '../../api/orderApi.js';
import '../Home.css';
import './ManageMenu.css';
import Sidebar from '../../components/Outlet/Sidebar';
import toast, { Toaster } from "react-hot-toast";
import { Check, X, ChefHat, Clock, MapPin, User, Package } from 'lucide-react';

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

                    {/* Tabs */}
                    <div className="order-tabs">
                        {[
                            { key: 'pending', label: 'Pending', icon: <Clock size={16} /> },
                            { key: 'accepted', label: 'Accepted', icon: <ChefHat size={16} /> },
                           
                            { key: 'completed', label: 'Completed', icon: <Package size={16} /> },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                className={`order-tab ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon}
                                {tab.label}
                                {counts[tab.key] > 0 && (
                                    <span className="tab-count">{counts[tab.key]}</span>
                                )}
                            </button>
                        ))}
                    </div>

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
                                <div
                                    key={order._id}
                                    className="order-card"
                                    style={{ animation: `fadeInUp 0.4s ease-out ${index * 0.06}s both` }}
                                >
                                    {/* Header */}
                                    <div className="order-card-header">
                                        <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                                        <span className={`order-status-badge ${getStatusBadgeClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="order-customer-info">
                                        <div className="customer-avatar">
                                            {order.customer?.name?.charAt(0).toUpperCase() || <User size={18} />}
                                        </div>
                                        <div className="customer-details">
                                            <h4>{order.customer?.name || 'Customer'}</h4>
                                            <p>{order.customer?.email || ''}</p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="order-items-list">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="order-item-row">
                                                <span>{item.quantity || 1}x {item.name}</span>
                                                <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Delivery Info */}
                                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} style={{ color: 'var(--accent)' }} />
                                            Drop: {order.dropLocation}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="order-footer">
                                        <div>
                                            <span className="order-total">₹{order.totalAmount?.toFixed(2)}</span>
                                            {order.deliveryFee > 0 && (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                                                    +₹{order.deliveryFee} delivery
                                                </span>
                                            )}
                                        </div>
                                        <span className="order-time">{formatTime(order.createdAt)}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    {order.status === 'Pending' && (
                                        <div className="order-action-buttons">
                                            <button
                                                className="btn-accept"
                                                onClick={() => handleAccept(order._id)}
                                            >
                                                <Check size={16} /> Accept
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleReject(order._id)}
                                            >
                                                <X size={16} /> Reject
                                            </button>
                                        </div>
                                    )}

                                    {/* Status progression buttons for accepted orders */}
                                    {getNextStatusAction(order) && (
                                        <div className="order-action-buttons">
                                            <button
                                                className="btn-status-update"
                                                onClick={() => handleStatusUpdate(order._id, getNextStatusAction(order).status)}
                                            >
                                                {getNextStatusAction(order).icon}
                                                {getNextStatusAction(order).label}
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleReject(order._id)}
                                            >
                                                <X size={16} /> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OutletOrders;
