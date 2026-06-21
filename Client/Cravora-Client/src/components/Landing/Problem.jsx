/**
 * Problem Component
 * Highlights campus food/delivery problems (long wait times, lack of delivery, limited earning options)
 * solved by Cravora.
 */
export default function Problem() {
    return (
        <section className="problem-section">
            <div className="landing-container">
                <div className="reveal">
                    <span className="section-label">The Problem</span>
                    <h2 className="section-title">
                        Campus food delivery<br />is broken.
                    </h2>
                    <p className="section-description">
                        Long queues, limited options, and no way to get food delivered to your hostel during late-night study sessions.
                    </p>
                </div>

                <div className="problem-grid">
                    <div className="problem-card reveal delay-1">
                        <div className="problem-icon">⏰</div>
                        <h3>Endless Wait Times</h3>
                        <p>Standing in 30-minute queues between classes when you just want a quick bite. Your break is gone before your food arrives.</p>
                    </div>
                    <div className="problem-card reveal delay-2">
                        <div className="problem-icon">🚫</div>
                        <h3>No Delivery Options</h3>
                        <p>Campus outlets don't deliver. You're stuck walking across campus in the rain or heat just to grab lunch.</p>
                    </div>
                    <div className="problem-card reveal delay-3">
                        <div className="problem-icon">💸</div>
                        <h3>No Earning Opportunity</h3>
                        <p>Students need flexible income but campus jobs are scarce. There's no way to earn between classes without a fixed schedule.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
