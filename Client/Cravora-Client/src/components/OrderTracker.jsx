// useRefe used to store values without causing re-render
import React, { useState, useEffect, useRef } from 'react';
import { getOrderById } from '../api/orderApi';
import { Check, Clock, ChefHat, Truck, Package } from 'lucide-react';
import '../pages/StudentDashboard.css';

const STATUSES = [
    { key: 'Pending', label: 'Order Placed', desc: 'Waiting for outlet to accept', icon: <Clock size={18} /> },
    { key: 'Accepted', label: 'Accepted', desc: 'Outlet accepted your order', icon: <Check size={18} /> },
    { key: 'Preparing', label: 'Preparing', desc: 'Your food is being prepared', icon: <ChefHat size={18} /> },
    { key: 'OutForDelivery', label: 'Out for Delivery', desc: 'Runner is on the way', icon: <Truck size={18} /> },
    { key: 'Delivered', label: 'Delivered', desc: 'Order delivered!', icon: <Package size={18} /> },
];

const OrderTracker = ({ orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    // Used to store the order status
    const intervalRef = useRef(null);

    const fetchOrder = async () => {
        try {
            const res = await getOrderById(orderId);
            setOrder(res.data.order);
            // Checks if the order status is delivered or cancelled
            if (['Delivered', 'Cancelled'].includes(res.data.order.status)) {
                // Stops the interval if the order is delivered or cancelled
            clearInterval(intervalRef.current);
            }
        } catch (err) {
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };
    // This useEffect hook is used to fetch the order status and update it every 5 seconds
    useEffect(() => {
        if (!orderId) return;
        // Fetches the order
        fetchOrder();
        // Updates the order status every 5 seconds
        intervalRef.current = setInterval(fetchOrder, 5000);
        // Clears the interval if the component unmounts
        return () => clearInterval(intervalRef.current);
    }, [orderId]);

    // Used to get the index of the current status
    const getStatusIndex = (status) => STATUSES.findIndex(s => s.key === status);

    // If the order is loading, display a loading message
    if (loading) return <div className="sd-loading">Loading order status...</div>;
    // If the order is not found, display an error message
    if (!order) return <div className="sd-empty"><h3>Could not load order</h3></div>;

    // Used to get the index of the current status
    const currentIndex = getStatusIndex(order.status);
    // Used to check if the order is cancelled
    const isCancelled = order.status === 'Cancelled';

    return (
        <div className="sd-tracking-card" style={{ animation: 'sdFadeUp 0.5s ease-out both' }}>
            <div className="sd-tracking-header">
                {/* Displays the order ID */}
                <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                {/* Displays the order status */}
                <p>
                    {isCancelled
                        ? 'This order was cancelled'
                        : order.status === 'Delivered'
                            ? 'Your order has been delivered! 🎉'
                            : 'Tracking your order in real-time'}
                </p>
            </div>

            {!isCancelled && (
                <div className="sd-timeline">
                    {STATUSES.map((step, i) => {
                        const isCompleted = i < currentIndex;
                        const isActive = i === currentIndex;
                        const isLast = i === STATUSES.length - 1;
                        return (
                            <div
                                key={step.key}
                                className={`sd-timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                            >
                                <div className="sd-timeline-dot-wrapper">
                                    <div className="sd-timeline-dot">
                                        {isCompleted ? <Check size={16} /> : step.icon}
                                    </div>
                                    {!isLast && <div className="sd-timeline-line" />}
                                </div>
                                <div className="sd-timeline-content">
                                    <h4>{step.label}</h4>
                                    <p>{step.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isCancelled && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#ef4444', fontWeight: 600, fontSize: '1.2rem' }}>
                    ❌ Order Cancelled
                </div>
            )}

            <div className="sd-tracking-details">
                {order.items?.map((item, i) => (
                    <div key={i} className="sd-tracking-row">
                        <span>{item.quantity || 1}x {item.name}</span>
                        <span>₹{(item.price * (item.quantity || 1)).toFixed(0)}</span>
                    </div>
                ))}
                <div className="sd-tracking-row" style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
                    <span>Delivery Fee</span>
                    <span>₹{order.deliveryFee || 0}</span>
                </div>
                <div className="sd-tracking-row" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent)' }}>₹{order.totalAmount?.toFixed(0)}</span>
                </div>
                <div className="sd-tracking-row">
                    <span>Drop Location</span>
                    <span>{order.dropLocation}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderTracker;
