import { useEffect } from "react";
import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Problem from "../components/Landing/Problem";
import Features from "../components/Landing/Features";
import HowItWorks from "../components/Landing/HowItWorks";
import SocialProof from "../components/Landing/SocialProof";
import FAQ from "../components/Landing/FAQ";
import CTA from "../components/Landing/CTA";
import Footer from "../components/Landing/Footer";
import "./Home.css";

const Home = () => {
    // Scroll-triggered animations
    useEffect(() => {
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

        const timeoutId = setTimeout(() => {
            const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
            elements.forEach((el) => {
                observer.observe(el);
            });
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            observer.disconnect();
        };
    }, []);

    return (
        <div className="landing-page">
            <Navbar />
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
