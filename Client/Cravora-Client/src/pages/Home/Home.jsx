/**
 * Landing Page Component (Home.jsx)
 * Serves as the public entry page for the Cravora application.
 * Sets up an IntersectionObserver to dynamically trigger fade-in scroll animation classes
 * for various page sections (.reveal, .reveal-left, etc.).
 */
import { useEffect } from "react";
import Navbar from "../../components/Landing/Navbar";
import Hero from "../../components/Landing/Hero";
import Problem from "../../components/Landing/Problem";
import Features from "../../components/Landing/Features";
import HowItWorks from "../../components/Landing/HowItWorks";
import SocialProof from "../../components/Landing/SocialProof";
import FAQ from "../../components/Landing/FAQ";
import CTA from "../../components/Landing/CTA";
import Footer from "../../components/Landing/Footer";
import "./Home.css";

const Home = () => {
    // Set up scroll-triggered anim hooks using the browser's IntersectionObserver API
    useEffect(() => {
        // Observer callback triggers when targets cross the viewport threshold
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // If target enters viewport, append the visibility trigger class
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" } // Offset root margins slightly for delay feel
        );

        // Short timeout to guarantee elements are rendered in DOM before query selector runs
        const timeoutId = setTimeout(() => {
            const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
            elements.forEach((el) => {
                observer.observe(el);
            });
        }, 100);

        // Cleanup function disconnects observer and clears timeout on component unmount
        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="landing-page">
            {/* Landing page header navbar links */}
            <Navbar />
            
            {/* Structural landing page blocks */}
            <Hero />
            <Problem />
            <Features />
            <HowItWorks />
            <SocialProof />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    );
};

export default Home;
