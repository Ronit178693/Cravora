import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

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
