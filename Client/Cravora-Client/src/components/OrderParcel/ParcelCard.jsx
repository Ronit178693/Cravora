import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

/**
 * ParcelCard Component
 * Renders an accordion card for a single peer-to-peer package shipment.
 * Expanding the card reveals detailed fields including specific runner contacts,
 * delivery fee, delivery instructions, status timeline map, and a button to
 * cancel pending requests.
 *
 * @param {Object} pkg - Package data object (containing pickup/drop coordinates, description, status, runner details)
 * @param {Boolean} isExpanded - Flag showing if details panel is open
 * @param {Function} setExpandedPkg - Toggle callback function changing expanding package ID
 * @param {String[]} statusSteps - Array of lifecycle steps (e.g. ['Pending', 'Accepted', 'Delivered'])
 * @param {Number} stepIdx - Current status index coordinates inside the timeline
 * @param {Function} getStatusColor - Hex color mapper based on delivery status key
 * @param {Function} getStatusIcon - Lucide Icon selector based on status value
 * @param {Function} formatDate - Timestamp formatter helper function
 * @param {Function} handleCancel - Action callback when cancelling a package request
 * @param {String|null} cancellingId - ID of package currently in transition of being cancelled
 */
const ParcelCard = ({
    pkg,
    isExpanded,
    setExpandedPkg,
    statusSteps,
    stepIdx,
    getStatusColor,
    getStatusIcon,
    formatDate,
    handleCancel,
    cancellingId
}) => {
    return (
        <div className={`op-pkg-card ${pkg.status === 'Cancelled' ? 'cancelled' : ''}`}>
            <div
                className="op-pkg-header"
                onClick={() => setExpandedPkg(isExpanded ? null : pkg._id)}
            >
                <div className="op-pkg-info">
                    <span className="op-pkg-type">{pkg.type}</span>
                    <span
                        className="op-pkg-status"
                        style={{ color: getStatusColor(pkg.status) }}
                    >
                        {getStatusIcon(pkg.status)} {pkg.status}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`op-pkg-chevron ${isExpanded ? 'expanded' : ''}`}
                />
            </div>

            {/* Route preview */}
            <div className="op-pkg-route">
                <span><MapPin size={12} /> {pkg.pickupLocation}</span>
                <span className="op-pkg-arrow">→</span>
                <span><MapPin size={12} /> {pkg.dropLocation}</span>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="op-pkg-details">
                    {/* Timeline */}
                    {pkg.status !== 'Cancelled' && (
                        <div className="op-timeline">
                            {statusSteps.map((step, i) => (
                                <div
                                    key={step}
                                    className={`op-timeline-step ${i <= stepIdx ? 'completed' : ''} ${i === stepIdx ? 'current' : ''}`}
                                >
                                    <div className="op-timeline-dot" />
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {pkg.description && (
                        <p className="op-pkg-desc"><strong>Description:</strong> {pkg.description}</p>
                    )}
                    {pkg.instructions && (
                        <p className="op-pkg-desc"><strong>Instructions:</strong> {pkg.instructions}</p>
                    )}
                    {pkg.runner && (
                        <p className="op-pkg-desc">
                            <strong>Runner:</strong> {pkg.runner.name}
                            {pkg.runner.phoneNumber && ` • ${pkg.runner.phoneNumber}`}
                        </p>
                    )}
                    <p className="op-pkg-meta">
                        Created: {formatDate(pkg.createdAt)}
                        {pkg.deliveryFee > 0 && ` • Fee: ₹${pkg.deliveryFee}`}
                        {pkg.quantity > 1 && ` • Qty: ${pkg.quantity}`}
                    </p>

                    {pkg.status === 'Pending' && (
                        <button
                            className="op-cancel-btn"
                            onClick={() => handleCancel(pkg._id)}
                            disabled={cancellingId === pkg._id}
                        >
                            {cancellingId === pkg._id ? 'Cancelling...' : 'Cancel Request'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParcelCard;
