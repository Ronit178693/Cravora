import React from 'react';
import { Package } from 'lucide-react';
import ParcelCard from './ParcelCard';

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
