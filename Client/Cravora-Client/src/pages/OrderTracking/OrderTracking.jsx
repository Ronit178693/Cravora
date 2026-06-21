import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import OrderTracker from '../../components/OrderTracker/OrderTracker';
import '../Dashboard/StudentDashboard.css';

const OrderTracking = () => {
    const { id } = useParams();

    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container">
                <Link to="/student-dashboard" className="sd-back-link">
                    <ArrowLeft size={16} /> Back to dashboard
                </Link>

                <OrderTracker orderId={id} />
            </div>
        </div>
    );
};

export default OrderTracking;
