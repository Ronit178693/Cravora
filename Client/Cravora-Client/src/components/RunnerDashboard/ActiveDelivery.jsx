import React from 'react';
import { Truck, ShoppingBag, Package, User, Phone, CheckCircle } from 'lucide-react';

const ActiveDelivery = ({ activeDelivery, getStatusColor, nextAction, handleStatusUpdate, updatingStatus }) => {
    if (!activeDelivery) return null;

    return (
        <div className="rd-active-section">
            <h2 className="rd-section-title active-pulse">
                <Truck size={20} /> Active Delivery
            </h2>
            <div className="rd-active-card">
                <div className="rd-active-type-badge" style={{ background: activeDelivery.type === 'order' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: activeDelivery.type === 'order' ? '#8b5cf6' : '#3b82f6' }}>
                    {activeDelivery.type === 'order' ? <ShoppingBag size={14} /> : <Package size={14} />}
                    {activeDelivery.type === 'order' ? 'Food Order' : 'Package'}
                </div>

                <div className="rd-active-status" style={{ color: getStatusColor(activeDelivery.data.status) }}>
                    ● {activeDelivery.data.status}
                </div>

                {/* Route */}
                <div className="rd-active-route">
                    <div className="rd-route-point">
                        <div className="rd-route-dot pickup" />
                        <div>
                            <span className="rd-route-label">Pickup</span>
                            <span className="rd-route-value">
                                {activeDelivery.type === 'order'
                                    ? (activeDelivery.data.outlet?.name || activeDelivery.data.pickupLocation)
                                    : activeDelivery.data.pickupLocation}
                            </span>
                        </div>
                    </div>
                    <div className="rd-route-line" />
                    <div className="rd-route-point">
                        <div className="rd-route-dot drop" />
                        <div>
                            <span className="rd-route-label">Drop-off</span>
                            <span className="rd-route-value">{activeDelivery.data.dropLocation}</span>
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="rd-active-info-grid">
                    <div className="rd-info-item">
                        <User size={14} />
                        <span>{activeDelivery.data.customer?.name || 'Customer'}</span>
                    </div>
                    {activeDelivery.data.customer?.phoneNumber && (
                        <div className="rd-info-item">
                            <Phone size={14} />
                            <a href={`tel:${activeDelivery.data.customer.phoneNumber}`}>
                                {activeDelivery.data.customer.phoneNumber}
                            </a>
                        </div>
                    )}
                    {activeDelivery.type === 'order' && activeDelivery.data.items && (
                        <div className="rd-info-item full-width">
                            <ShoppingBag size={14} />
                            <span>{activeDelivery.data.items.map(i => `${i.quantity || 1}x ${i.name}`).join(', ')}</span>
                        </div>
                    )}
                    {activeDelivery.type === 'package' && activeDelivery.data.description && (
                        <div className="rd-info-item full-width">
                            <Package size={14} />
                            <span>{activeDelivery.data.description}</span>
                        </div>
                    )}
                    {activeDelivery.data.deliveryFee > 0 && (
                        <div className="rd-info-item">
                            <span className="rd-fee-badge">₹{activeDelivery.data.deliveryFee} fee</span>
                        </div>
                    )}
                </div>

                {nextAction && (
                    <button
                        className="rd-status-btn"
                        onClick={() => handleStatusUpdate(nextAction.status)}
                        disabled={updatingStatus}
                    >
                        <CheckCircle size={16} />
                        {updatingStatus ? 'Updating...' : nextAction.label}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActiveDelivery;
