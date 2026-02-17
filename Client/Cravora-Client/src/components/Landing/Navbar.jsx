import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
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
