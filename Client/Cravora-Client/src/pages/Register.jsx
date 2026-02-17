import RegisterForm from "../components/Register/RegisterForm";
import RegisterVisuals from "../components/Register/RegisterVisuals";
import "./Register.css";

export default function Register() {
    return (
        <div className="register-page">
            {/* Background elements */}
            <div className="register-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            <div className="register-container">
                <div className="register-grid-layout">
                    <RegisterForm />
                    <RegisterVisuals />
                </div>
            </div>
        </div>
    );
}
