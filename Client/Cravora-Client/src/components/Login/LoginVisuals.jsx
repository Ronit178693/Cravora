
import { Bike, ShoppingBag, Clock } from "lucide-react";

export default function LoginVisuals() {
    return (
        <div className="login-visuals">
            <div className="visual-content">
                <div className="visual-icon">
                    <ShoppingBag size={32} color="var(--accent)" />
                </div>

                <div className="visual-header">
                    <h2>Hungry?</h2>
                    <p>Your favorite campus food is just a few clicks away.</p>
                </div>

                <div className="features-list">
                    <div className="feature-item">
                        <div className="feature-icon-wrapper">
                            <Clock size={20} />
                        </div>
                        <div className="feature-text">
                            <h3>Lightning Fast</h3>
                            <p>Get food delivered in under 20 minutes.</p>
                        </div>
                    </div>
                </div>

                {/* 3D Floating Element */}
                <div className="visual-card-3d">
                    {/* User Card */}
                    <div className="floating-card user-card">
                        <div className="avatar">U</div>
                        <div className="info">
                            <span>Order Placed</span>
                            <span className="badge">Just now</span>
                        </div>
                    </div>

                    {/* Runner Card */}
                    <div className="floating-card runner-card">
                        <div className="avatar runner">R</div>
                        <div className="info">
                            <span>Runner Assigned</span>
                            <span className="status">On the way</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
