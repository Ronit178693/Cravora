import { Zap, Shield, MapPin, TrendingUp } from "lucide-react";

export default function RegisterVisuals() {
    return (
        <div className="register-visuals">
            <div className="visual-content">
                <div className="visual-header">
                    <h2>Join the fastest growing campus network.</h2>
                    <p>Connect with thousands of students, outlets, and runners.</p>
                </div>

                <div className="features-list">
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <Zap size={24} />
                        </div>
                        <div className="feature-text">
                            <h3>Lightning Fast Delivery</h3>
                            <p>Get your favorite food delivered in minutes.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <TrendingUp size={24} />
                        </div>
                        <div className="feature-text">
                            <h3>Earn While You Learn</h3>
                            <p>Become a runner and make money between classes.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <Shield size={24} />
                        </div>
                        <div className="feature-text">
                            <h3>Secure Payments</h3>
                            <p>100% safe and verified transactions.</p>
                        </div>
                    </div>
                </div>

                <div className="visual-card-3d">
                    <div className="floating-card user-card">
                        <div className="avatar">JD</div>
                        <div className="info">
                            <span>John Doe</span>
                            <span className="badge">Student</span>
                        </div>
                    </div>
                    <div className="floating-card runner-card">
                        <div className="avatar runner">⚡</div>
                        <div className="info">
                            <span>Runner Mode</span>
                            <span className="status">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
