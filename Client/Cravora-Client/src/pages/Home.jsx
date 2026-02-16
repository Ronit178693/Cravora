import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const [scrolled, setScrolled] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const navigate = useNavigate();

    // Scroll-triggered animations
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => {
            observer.observe(el);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, []);

    const faqs = [
        {
            q: "Is Cravora free for students?",
            a: "Yes! Ordering food and sending packages is completely free. You only pay for your food and a small delivery fee.",
        },
        {
            q: "How do I become a delivery runner?",
            a: "Any student can become a runner! Sign up, toggle your availability, and start accepting deliveries between classes to earn extra cash.",
        },
        {
            q: "Which campuses is Cravora available on?",
            a: "We're currently launching on select university campuses. Contact us to bring Cravora to your campus!",
        },
        {
            q: "How fast is the delivery?",
            a: "Since runners are fellow students already on campus, most deliveries are completed within 15-25 minutes.",
        },
        {
            q: "Can I track my order in real-time?",
            a: "Absolutely. You'll get live status updates from the moment your order is placed until it's delivered to your door.",
        },
    ];

    return (
        <div className="landing-page">
            {/* NAVBAR */}
            <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
                <div className="landing-container nav-inner">
                    <a href="#" className="nav-logo">Cravora</a>
                    <ul className="nav-links">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#how">How It Works</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a className="nav-cta" onClick={() => navigate("/register")}>Get Started</a></li>
                    </ul>
                    <button className="nav-hamburger" aria-label="Menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
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
                            <button className="btn-secondary" onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}>
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

            {/* PROBLEM SECTION */}
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

            {/* FEATURES SECTION */}
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

            {/* HOW IT WORKS */}
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

            {/* SOCIAL PROOF */}
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


            {/* FAQ */}
            <section className="faq-section" id="faq">
                <div className="landing-container">
                    <div className="section-header reveal">
                        <span className="section-label">FAQ</span>
                        <h2 className="section-title">Got questions?</h2>
                        <p className="section-description">
                            Here are answers to the most common ones. Still unsure? Reach out to us!
                        </p>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`faq-item ${openFaq === i ? "open" : ""}`}
                            >
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    {faq.q}
                                    <span className="faq-toggle">+</span>
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="cta-section">
                <div className="landing-container">
                    <div className="cta-box reveal-scale">
                        <h2>Ready to stop waiting<br />in line?</h2>
                        <p>Join hundreds of students who've already made campus life easier with Cravora.</p>
                        <div className="cta-actions">
                            <button className="btn-primary" onClick={() => navigate("/register")}>
                                Get Started — It's Free →
                            </button>
                            <button className="btn-secondary" onClick={() => navigate("/login")}>
                                I Already Have an Account
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="landing-footer">
                <div className="landing-container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h3>Cravora</h3>
                            <p>Campus cravings, delivered fast. The all-in-one platform for food ordering, package delivery, and student earnings.</p>
                        </div>
                        <div className="footer-col">
                            <h4>Product</h4>
                            <ul>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#how">How It Works</a></li>
                                <li><a href="#faq">FAQ</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Blog</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-col">
                            <h4>Legal</h4>
                            <ul>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                                <li><a href="#">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2026 Cravora. Built with ❤️ by students, for students.</p>
                        <div className="footer-socials">
                            <a href="#" className="footer-social" aria-label="Twitter">𝕏</a>
                            <a href="#" className="footer-social" aria-label="Instagram">📷</a>
                            <a href="#" className="footer-social" aria-label="LinkedIn">in</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
