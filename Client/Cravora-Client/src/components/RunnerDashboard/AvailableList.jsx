import React from 'react';
import { MapPin, AlertCircle, Truck, ShoppingBag, Package } from 'lucide-react';

/**
 * AvailableList Component
 * Displays grid layouts of all pending orders and packages looking for runner assignment.
 * Automatically disables buttons and gives a warnings banner if the runner already has
 * an active assignment in progress.
 *
 * @param {Object[]} availableOrders - Array of unassigned restaurant food orders
 * @param {Object[]} availablePackages - Array of unassigned peer-to-peer package delivery requests
 * @param {Boolean} hasActiveDelivery - Flag identifying if the current runner is already performing a delivery
 * @param {String|null} accepting - ID of the order/package currently in the process of being accepted
 * @param {Function} handleAcceptOrder - Action callback when accepting a food order
 * @param {Function} handleAcceptPackage - Action callback when accepting a peer-to-peer package
 * @param {Function} formatDate - Timestamp formatter helper function
 */
const AvailableList = ({
    availableOrders,
    availablePackages,
    hasActiveDelivery,
    accepting,
    handleAcceptOrder,
    handleAcceptPackage,
    formatDate
}) => {
    return (
        <div className="rd-available-section">
            <h2 className="rd-section-title">
                <MapPin size={20} /> Available Deliveries
            </h2>

            {hasActiveDelivery && (
                <div className="rd-busy-notice">
                    <AlertCircle size={16} />
                    You already have an active delivery. Complete it before accepting a new one.
                </div>
            )}

            {availableOrders.length === 0 && availablePackages.length === 0 ? (
                <div className="rd-empty">
                    <Truck size={40} />
                    <h3>No deliveries available right now</h3>
                    <p>Check back soon — new orders pop up throughout the day!</p>
                </div>
            ) : (
                <div className="rd-cards-grid">
                    {/* Food Orders */}
                    {availableOrders.map(order => (
                        <div key={order._id} className="rd-card">
                            <div className="rd-card-header">
                                <span className="rd-card-type order">
                                    <ShoppingBag size={12} /> Food Order
                                </span>
                                <span className="rd-card-time">{formatDate(order.createdAt)}</span>
                            </div>

                            <div className="rd-card-route">
                                <div className="rd-card-route-row">
                                    <MapPin size={13} />
                                    <span>{order.outlet?.name || 'Outlet'} — {order.outlet?.location || order.pickupLocation}</span>
                                </div>
                                <div className="rd-card-route-arrow">↓</div>
                                <div className="rd-card-route-row">
                                    <MapPin size={13} />
                                    <span>{order.dropLocation}</span>
                                </div>
                            </div>

                            <div className="rd-card-items">
                                {order.items?.slice(0, 3).map((item, i) => (
                                    <span key={i} className="rd-item-tag">{item.quantity || 1}x {item.name}</span>
                                ))}
                                {order.items?.length > 3 && <span className="rd-item-tag more">+{order.items.length - 3} more</span>}
                            </div>

                            <div className="rd-card-footer">
                                <div className="rd-card-meta">
                                    <span className="rd-card-total">₹{order.totalAmount}</span>
                                    {order.deliveryFee > 0 && (
                                        <span className="rd-card-fee">+₹{order.deliveryFee} fee</span>
                                    )}
                                </div>
                                <button
                                    className="rd-accept-btn"
                                    onClick={() => handleAcceptOrder(order._id)}
                                    disabled={hasActiveDelivery || accepting === order._id}
                                >
                                    {accepting === order._id ? 'Accepting...' : 'Accept'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Packages */}
                    {availablePackages.map(pkg => (
                        <div key={pkg._id} className="rd-card">
                            <div className="rd-card-header">
                                <span className="rd-card-type package">
                                    <Package size={12} /> {pkg.type}
                                </span>
                                <span className="rd-card-time">{formatDate(pkg.createdAt)}</span>
                            </div>

                            <div className="rd-card-route">
                                <div className="rd-card-route-row">
                                    <MapPin size={13} />
                                    <span>{pkg.pickupLocation}</span>
                                </div>
                                <div className="rd-card-route-arrow">↓</div>
                                <div className="rd-card-route-row">
                                    <MapPin size={13} />
                                    <span>{pkg.dropLocation}</span>
                                </div>
                            </div>

                            {pkg.description && (
                                <p className="rd-card-desc">{pkg.description}</p>
                            )}

                            <div className="rd-card-footer">
                                <div className="rd-card-meta">
                                    {pkg.quantity > 1 && <span className="rd-card-qty">Qty: {pkg.quantity}</span>}
                                    {pkg.deliveryFee > 0 && (
                                        <span className="rd-card-fee">₹{pkg.deliveryFee} fee</span>
                                    )}
                                </div>
                                <button
                                    className="rd-accept-btn"
                                    onClick={() => handleAcceptPackage(pkg._id)}
                                    disabled={hasActiveDelivery || accepting === pkg._id}
                                >
                                    {accepting === pkg._id ? 'Accepting...' : 'Accept'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableList;
