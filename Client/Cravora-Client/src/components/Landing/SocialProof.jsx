/**
 * SocialProof Component
 * Showcases stats (users, delivered order counts) and customer testimonial quotes from students.
 */
export default function SocialProof() {
    return (
        <section className="social-section">
            <div className="landing-container">
                <div className="section-header reveal">
                    <span className="section-label">Social Proof</span>
                    <h2 className="section-title">Loved by students.</h2>
                    <p className="section-description">
                        Join hundreds of students who are already saving time and earning money with Cravora.
                    </p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card reveal delay-1">
                        <div className="stat-number">500+</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-card reveal delay-2">
                        <div className="stat-number">2,000+</div>
                        <div className="stat-label">Orders Delivered</div>
                    </div>
                    <div className="stat-card reveal delay-3">
                        <div className="stat-number">15 min</div>
                        <div className="stat-label">Avg. Delivery Time</div>
                    </div>
                    <div className="stat-card reveal delay-4">
                        <div className="stat-number">4.8★</div>
                        <div className="stat-label">Student Rating</div>
                    </div>
                </div>

                <div className="testimonials-grid">
                    <div className="testimonial-card reveal delay-1">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-text">
                            "I used to waste 40 minutes just getting lunch. Now I order from my hostel and it's at my door in 15 minutes. Game changer."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">A</div>
                            <div className="testimonial-info">
                                <h4>Arjun M.</h4>
                                <p>3rd Year, CS</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card reveal delay-2">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-text">
                            "I deliver between my classes and easily make ₹300-500 a day. It's the most flexible side hustle on campus."
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">P</div>
                            <div className="testimonial-info">
                                <h4>Priya S.</h4>
                                <p>2nd Year, Design</p>
                            </div>
                        </div>
                    </div>
                    <div className="testimonial-card reveal delay-3">
                        <div className="testimonial-stars">★★★★★</div>
                        <p className="testimonial-text">
                            "The package delivery feature saved me when I forgot my charger in another building. Got it in 10 minutes!"
                        </p>
                        <div className="testimonial-author">
                            <div className="testimonial-avatar">R</div>
                            <div className="testimonial-info">
                                <h4>Rahul K.</h4>
                                <p>4th Year, MBA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
