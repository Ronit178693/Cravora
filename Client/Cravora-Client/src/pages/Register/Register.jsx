/**
 * Register Page Wrapper Component
 * Renders the main responsive grid layout for student/merchant registration.
 * Combines the multi-role registration form (RegisterForm) with brand aesthetics (RegisterVisuals).
 */
import RegisterForm from "../../components/Register/RegisterForm";
import RegisterVisuals from "../../components/Register/RegisterVisuals";
import "./Register.css";

export default function Register() {
    return (
        <div className="register-page">
            {/* Ambient decorative background glows */}
            <div className="register-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Layout bounds container */}
            <div className="register-container">
                <div className="register-grid-layout">
                    {/* Left panel: Registration inputs & form flow validation */}
                    <RegisterForm />
                    {/* Right panel: Side display visuals and taglines */}
                    <RegisterVisuals />
                </div>
            </div>
        </div>
    );
}
