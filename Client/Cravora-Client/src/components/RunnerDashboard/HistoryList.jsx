import React from 'react';
import { ShoppingBag, Package, MapPin, Truck, Clock } from 'lucide-react';

/**
 * HistoryList Component
 * Displays a tabular list of completed or cancelled orders and package delivery jobs
 * that this runner has processed previously. Shows routes, timestamps, items, and earnings.
 *
 * @param {Object[]} filtered - Array of order and package objects matching search/filter constraints
 * @param {Function} formatDate - Timestamp formatter helper function
 * @param {Function} getStatusColor - Hex color mapper based on delivery status key
 * @param {Function} getStatusIcon - Lucide Icon selector function based on status value
 */
const HistoryList = ({ filtered, formatDate, getStatusColor, getStatusIcon }) => {
    return (
        <div className="dh-list">
            {filtered.map(d => (
                <div key={d._id + d._type} className="dh-card">
                    <div className="dh-card-left">
                        <div className="dh-card-type-badge" style={{
                            background: d._type === 'order' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: d._type === 'order' ? '#8b5cf6' : '#3b82f6'
                        }}>
                            {d._type === 'order' ? <ShoppingBag size={11} /> : <Package size={11} />}
                            {d._type === 'order' ? 'Food' : d.type || 'Package'}
                        </div>

                        <div className="dh-card-route">
                            <span className="dh-route-from">
                                <MapPin size={12} />
                                {d._type === 'order' ? (d.outlet?.name || d.pickupLocation) : d.pickupLocation}
                            </span>
                            <span className="dh-route-arrow">→</span>
                            <span className="dh-route-to">
                                <MapPin size={12} />
                                {d.dropLocation}
                            </span>
                        </div>

                        {d._type === 'order' && d.items && (
                            <div className="dh-items-summary">
                                {d.items.slice(0, 3).map((item, i) => (
                                    <span key={i}>{item.quantity || 1}x {item.name}</span>
                                ))}
                                {d.items.length > 3 && <span>+{d.items.length - 3} more</span>}
                            </div>
                        )}

                        <div className="dh-card-date">{formatDate(d.createdAt)}</div>
                    </div>

                    <div className="dh-card-right">
                        <div className="dh-card-status" style={{ color: getStatusColor(d.status) }}>
                            {getStatusIcon(d.status)} {d.status}
                        </div>
                        {d.deliveryFee > 0 && (
                            <div className="dh-card-fee">₹{d.deliveryFee}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryList;
