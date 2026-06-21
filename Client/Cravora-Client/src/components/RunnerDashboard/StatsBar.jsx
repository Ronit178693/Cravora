import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Clock, ChevronRight } from 'lucide-react';

const StatsBar = ({ fetchAll, refreshing }) => {
    return (
        <div className="rd-header">
            <div>
                <h1 className="sd-page-title">Runner <span>Dashboard</span></h1>
                <p className="sd-page-subtitle">
                    Accept deliveries and earn while helping your campus community.
                </p>
            </div>
            <div className="rd-header-actions">
                <button
                    className="rd-refresh-btn"
                    onClick={() => fetchAll(true)}
                    disabled={refreshing}
                >
                    <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <Link to="/delivery-history" className="rd-history-link">
                    <Clock size={16} /> Delivery History
                    <ChevronRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default StatsBar;
