import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { Compass, ArrowLeft } from "lucide-react";
import "../Dashboard/StudentDashboard.css";

const NotFound = () => {
    return (
        <div className="sd-page">
            <Navbar />
            <div className="sd-container" style={{ textAlign: "center", paddingTop: "80px", paddingBottom: "80px" }}>
                <Compass size={64} style={{ color: "var(--accent)", marginBottom: "20px" }} />
                <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--text-main)" }}>404 - Page Not Found</h1>
                <p style={{ color: "var(--text-sub)", marginBottom: "30px" }}>
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link to="/" className="sd-back-link" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <ArrowLeft size={16} /> Return to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
