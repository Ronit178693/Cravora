import { useNavigate } from "react-router-dom";

/**
 * Hero Component
 * Renders the top hero screen of the landing page, showing statistics, 
 * animated gradient branding text, action links, and mock 3D order detail cards.
 */
export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
            <div className="hero-grid"></div>

            <div className="landing-container hero-content">
                <div className="hero-text">
                    <div className="hero-badge">
                        <span className="pulse"></span>
                        Now live on campus
                    </div>
                    <h1>
                        Campus cravings,
                        <br />
                        <span className="gradient-text">delivered fast.</span>
                    </h1>
                    <p className="hero-description">
                        Order from your favorite campus outlets, send packages across campus, or earn money delivering — all in one app built for students, by students.
                    </p>
                    <div className="hero-actions">
                        <button className="btn-primary" onClick={() => navigate("/register")}>
                            Start Ordering →
                        </button>
                        <button className="btn-secondary" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
                            See How It Works
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <h3>500+</h3>
                            <p>Active Students</p>
                        </div>
                        <div className="hero-stat">
                            <h3>15 min</h3>
                            <p>Avg. Delivery</p>
                        </div>
                        <div className="hero-stat">
                            <h3>12+</h3>
                            <p>Campus Outlets</p>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="hero-3d-card">
                        <span className="floating-element float-1">🍕</span>
                        <span className="floating-element float-2">🍔</span>
                        <span className="floating-element float-3">☕</span>
                        <span className="floating-element float-4">📦</span>

                        <div className="card-header">
                            <div className="card-header-top">
                                <div className="card-avatar">🎓</div>
                                <div className="card-status">
                                    <span className="dot"></span> Preparing
                                </div>
                            </div>
                            <div className="card-restaurant">
                                Campus Bites <span>• 8 min away</span>
                            </div>
                        </div>

                        <div className="card-items">
                            <div className="card-item">
                                <div className="card-item-left">
                                    <span className="card-item-emoji">🍔</span>
                                    <div>
                                        <div className="card-item-name">Classic Burger</div>
                                        <div className="card-item-qty">x1</div>
                                    </div>
                                </div>
                                <span className="card-item-price">₹120</span>
                            </div>
                            <div className="card-item">
                                <div className="card-item-left">
                                    <span className="card-item-emoji">🍟</span>
                                    <div>
                                        <div className="card-item-name">Loaded Fries</div>
                                        <div className="card-item-qty">x1</div>
                                    </div>
                                </div>
                                <span className="card-item-price">₹80</span>
                            </div>
                            <div className="card-item">
                                <div className="card-item-left">
                                    <span className="card-item-emoji">🥤</span>
                                    <div>
                                        <div className="card-item-name">Cold Coffee</div>
                                        <div className="card-item-qty">x2</div>
                                    </div>
                                </div>
                                <span className="card-item-price">₹100</span>
                            </div>
                        </div>

                        <div className="card-footer">
                            <div className="card-total">
                                <span className="card-total-label">Total</span>
                                <span className="card-total-price">₹300</span>
                            </div>
                            <div className="card-track">Track Order →</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
