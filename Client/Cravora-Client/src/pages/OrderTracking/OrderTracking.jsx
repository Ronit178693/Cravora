/**
 * Order Tracking Page Component
 * Dedicated standalone page to track a specific customer food order in real-time.
 * Consumes the OrderTracker component, passing along the dynamic order ID from the URL parameters.
 */
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import OrderTracker from '../../components/OrderTracker/OrderTracker';
import '../Dashboard/StudentDashboard.css';

const OrderTracking = () => {
    // Extract dynamic order ID from the URL path (/order-tracking/:id)
    const { id } = useParams();

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                {/* Back navigations link */}
                <Link to="/student-dashboard" className="sd-back-link">
                    <ArrowLeft size={16} /> Back to dashboard
                </Link>

                {/* Live tracking details block */}
                <OrderTracker orderId={id} />
            </div>
        </div>
    );
};

export default OrderTracking;
