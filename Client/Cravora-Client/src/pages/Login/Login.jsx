import LoginForm from "../../components/Login/LoginForm";
import LoginVisuals from "../../components/Login/LoginVisuals";
import "./Login.css";

export default function Login() {
    return (
        <div className="login-page">
            {/* Background elements */}
            <div className="login-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="login-container">
                <div className="login-grid-layout">
                    <LoginVisuals />
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
