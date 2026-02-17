import { useState } from "react";

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState(null);

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
    );
}
