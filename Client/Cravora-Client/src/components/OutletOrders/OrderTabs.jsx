import React from 'react';
import { Clock, ChefHat, Package } from 'lucide-react';

/**
 * OrderTabs Component
 * Displays tabs for filtering orders inside the merchant's orders dashboard
 * (Pending, Accepted, or Completed), including dynamic count indicators for each state.
 *
 * @param {String} activeTab - Key identifier of current active tab ('pending' | 'accepted' | 'completed')
 * @param {Function} setActiveTab - Callback updating parent active tab state
 * @param {Object} counts - Object mapping tab keys to order quantities (e.g. { pending: 2, accepted: 0 })
 */
const OrderTabs = ({ activeTab, setActiveTab, counts }) => {
    return (
        <div className="order-tabs">
            {[
                { key: 'pending', label: 'Pending', icon: <Clock size={16} /> },
                { key: 'accepted', label: 'Accepted', icon: <ChefHat size={16} /> },
                { key: 'completed', label: 'Completed', icon: <Package size={16} /> },
            ].map(tab => (
                <button
                    key={tab.key}
                    className={`order-tab ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.key)}
                >
                    {tab.icon}
                    {tab.label}
                    {counts[tab.key] > 0 && (
                        <span className="tab-count">{counts[tab.key]}</span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default OrderTabs;
