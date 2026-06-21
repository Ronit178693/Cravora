import React from 'react';
import { Check, X, ChefHat, MapPin, User } from 'lucide-react';

/**
 * MerchantOrderCard Component
 * Displays a single restaurant food order card in the merchant portal.
 * Features customer information, ordered food items list, drop location, totals,
 * and context-sensitive action triggers to Accept, Reject, or progress the order
 * status (e.g. from Accepted to Preparing, or Preparing to Ready).
 *
 * @param {Object} order - Food order data object (containing items list, totals, status, customer profile)
 * @param {Number} index - Render iteration index used to stagger entry animations
 * @param {Function} getStatusBadgeClass - Function mapping status to CSS badge classes
 * @param {Function} formatTime - Timestamp formatter helper function
 * @param {Function} getNextStatusAction - Helper computing the next available status transition configuration
 * @param {Function} handleAccept - Action callback on accepting a pending order
 * @param {Function} handleReject - Action callback on rejecting/cancelling an order
 * @param {Function} handleStatusUpdate - Action callback to push status updates
 */
const MerchantOrderCard = ({
    order,
    index,
    getStatusBadgeClass,
    formatTime,
    getNextStatusAction,
    handleAccept,
    handleReject,
    handleStatusUpdate
}) => {
    return (
        <div
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
    );
};

export default MerchantOrderCard;
