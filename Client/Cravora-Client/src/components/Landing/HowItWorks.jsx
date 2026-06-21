/**
 * HowItWorks Component
 * Explains the 3-step lifecycle flow of Cravora (Browse, Runner Pickup, Delivery Completion).
 */
export default function HowItWorks() {
    return (
        <section className="how-section" id="how">
            <div className="landing-container">
                <div className="section-header reveal">
                    <span className="section-label">How It Works</span>
                    <h2 className="section-title">Three steps. That's it.</h2>
                    <p className="section-description">
                        Getting food delivered or earning money on campus has never been this simple.
                    </p>
                </div>

                <div className="how-steps">
                    <div className="how-step reveal delay-1">
                        <div className="step-number">01</div>
                        <div className="step-icon">📱</div>
                        <h3>Browse & Order</h3>
                        <p>Pick your favorite outlet, build your order, and place it in seconds. Or create a package delivery request.</p>
                    </div>
                    <div className="how-step reveal delay-2">
                        <div className="step-number">02</div>
                        <div className="step-icon">🏃</div>
                        <h3>A Runner Picks It Up</h3>
                        <p>A nearby student runner accepts your order, picks it up from the outlet, and heads your way.</p>
                    </div>
                    <div className="how-step reveal delay-3">
                        <div className="step-number">03</div>
                        <div className="step-icon">✅</div>
                        <h3>Delivered to You</h3>
                        <p>Get your food or package delivered right to your hostel, classroom, or wherever you are on campus.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
