import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Navbar Component (Landing Page Specific)
 * Renders the simple landing page navigation header. 
 * Adds active scroll listeners to trigger background blur/styling changes.
 */
export default function Navbar() {
    // Scroll state - toggles styling when the user scrolls past a threshold
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`}>
            <div className="landing-container nav-inner">
                <a href="#" className="nav-logo">Cravora</a>
                <ul className="nav-links">
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how">How It Works</a></li>
                    <li><a href="#faq">FAQ</a></li>
                    <li><a className="nav-cta" onClick={() => navigate("/register")}>Get Started</a></li>
                </ul>
            </div>
        </nav>
    );
}
