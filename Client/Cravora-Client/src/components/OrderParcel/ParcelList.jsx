import React from 'react';
import { Package } from 'lucide-react';
import ParcelCard from './ParcelCard';

/**
 * ParcelList Component
 * Displays a list/feed of peer-to-peer package delivery requests submitted by the logged-in student.
 * Handles initial loading spinners, empty-state messaging, and maps over individual ParcelCard items.
 *
 * @param {Boolean} loadingPackages - Indicates if packages are loading from the database
 * @param {Object[]} myPackages - Array of package requests created by the user
 * @param {String|null} expandedPkg - ID of the package card currently expanded in accordion view
 * @param {Function} setExpandedPkg - Toggle callback to expand/collapse details
 * @param {String[]} statusSteps - Array of timeline milestones
 * @param {Function} getStepIndex - Helper returning step index from status string
 * @param {Function} getStatusColor - Hex color mapper based on delivery status key
 * @param {Function} getStatusIcon - Lucide Icon selector based on status value
 * @param {Function} formatDate - Timestamp formatter helper function
 * @param {Function} handleCancel - Action callback when cancelling a package request
 * @param {String|null} cancellingId - ID of package currently in transition of being cancelled
 */
const ParcelList = ({
    loadingPackages,
    myPackages,
    expandedPkg,
    setExpandedPkg,
    statusSteps,
    getStepIndex,
    getStatusColor,
    getStatusIcon,
    formatDate,
    handleCancel,
    cancellingId
}) => {
    return (
        <div className="op-packages-section">
            <h3 className="op-packages-title">
                <Package size={18} /> My Packages
            </h3>

            {loadingPackages ? (
                <div className="sd-loading">Loading your packages...</div>
            ) : myPackages.length === 0 ? (
                <div className="sd-empty">
                    <h3>No packages yet</h3>
                    <p>Create your first delivery request!</p>
                </div>
            ) : (
                <div className="op-packages-list">
                    {myPackages.map(pkg => (
                        <ParcelCard
                            key={pkg._id}
                            pkg={pkg}
                            isExpanded={expandedPkg === pkg._id}
                            setExpandedPkg={setExpandedPkg}
                            statusSteps={statusSteps}
                            stepIdx={getStepIndex(pkg.status)}
                            getStatusColor={getStatusColor}
                            getStatusIcon={getStatusIcon}
                            formatDate={formatDate}
                            handleCancel={handleCancel}
                            cancellingId={cancellingId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParcelList;
