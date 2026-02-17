export default function Features() {
    return (
        <section className="features-section" id="features">
            <div className="landing-container">
                <div className="section-header reveal">
                    <span className="section-label">Features</span>
                    <h2 className="section-title">Everything you need,<br />nothing you don't.</h2>
                    <p className="section-description">
                        Built specifically for the campus lifestyle. Fast, simple, and designed around how students actually live.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card reveal delay-1">
                        <div className="feature-icon">🍽️</div>
                        <h3>Order from Outlets</h3>
                        <p>Browse menus from every campus outlet, customize your order, and get it delivered to your doorstep.</p>
                    </div>
                    <div className="feature-card reveal delay-2">
                        <div className="feature-icon">📦</div>
                        <h3>Package Delivery</h3>
                        <p>Need something delivered across campus? Send packages to friends, hostels, or departments in minutes.</p>
                    </div>
                    <div className="feature-card reveal delay-3">
                        <div className="feature-icon">💰</div>
                        <h3>Earn as a Runner</h3>
                        <p>Turn your free time into cash. Accept deliveries between classes and earn on your own schedule.</p>
                    </div>
                    <div className="feature-card reveal delay-4">
                        <div className="feature-icon">📍</div>
                        <h3>Live Tracking</h3>
                        <p>Know exactly where your order is. Real-time status updates from preparation to delivery.</p>
                    </div>
                    <div className="feature-card reveal delay-5">
                        <div className="feature-icon">⚡</div>
                        <h3>Lightning Fast</h3>
                        <p>Runners are already on campus. Average delivery time is just 15 minutes — faster than walking there yourself.</p>
                    </div>
                    <div className="feature-card reveal delay-6">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure & Trusted</h3>
                        <p>Verified student accounts, secure payments, and a rating system to keep quality high.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
