import { useNavigate } from "react-router-dom";

export default function CTA() {
    const navigate = useNavigate();

    return (
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
    );
}
