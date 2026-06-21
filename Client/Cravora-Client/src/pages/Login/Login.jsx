/**
 * Login Page Wrapper Component
 * Renders the main responsive grid layout for user authentication.
 * Integrates the side promotional graphics (LoginVisuals) with the credentials submission form (LoginForm).
 */
import LoginForm from "../../components/Login/LoginForm";
import LoginVisuals from "../../components/Login/LoginVisuals";
import "./Login.css";

export default function Login() {
    return (
        <div className="login-page">
            {/* Visual background ambient glowing orbs */}
            <div className="login-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Main responsive grid layout container */}
            <div className="login-container">
                <div className="login-grid-layout">
                    {/* Left panel: Promotional/Visual context */}
                    <LoginVisuals />
                    {/* Right panel: Credentials authentication input form */}
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
