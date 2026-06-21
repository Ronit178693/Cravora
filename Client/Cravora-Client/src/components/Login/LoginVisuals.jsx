
import {ShoppingBag, Clock } from "lucide-react";

/**
 * LoginVisuals Component
 * Renders the decorative visual sidebar for the login page, containing
 * marketing copy, icons, and CSS-animated 3D floating dashboard cards
 * to present a premium brand experience.
 */
export default function LoginVisuals() {
    return (
        <div className="login-visuals">
            <div className="visual-content">
                {/* Decorative header icon */}
                <div className="visual-icon">
                    <ShoppingBag size={32} color="var(--accent)" />
                </div>

                {/* Slogan and marketing copy */}
                <div className="visual-header">
                    <h2>Hungry?</h2>
                    <p>Your favorite campus food is just a few clicks away.</p>
                </div>

                {/* Speed feature highlight */}
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

                {/* 3D Floating Element - Simulates active order & runner tracking */}
                <div className="visual-card-3d">
                    {/* User notification bubble mock */}
                    <div className="floating-card user-card">
                        <div className="avatar">U</div>
                        <div className="info">
                            <span>Order Placed</span>
                            <span className="badge">Just now</span>
                        </div>
                    </div>

                    {/* Runner tracking bubble mock */}
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
