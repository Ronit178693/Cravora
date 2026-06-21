/**
 * Forgot Password Page Component
 * Implements a 2-step password recovery flow using dynamic states:
 * - Step 1: User enters email; requests and triggers OTP dispatch.
 * - Step 2: User submits the OTP along with the new password to confirm changes.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Mail, KeyRound, Lock, ArrowLeft, Send, Eye, EyeOff } from "lucide-react";
import FormInput from "../../components/FormInput/FormInput.jsx";
import { requestPasswordResetOTP, resetPassword } from "../../api/authApi";
import "./ForgotPassword.css";

export default function ForgotPassword() {
    const navigate = useNavigate();
    
    // Tracks current step of password recovery (1 = Email entry/OTP request, 2 = OTP validation/Password reset)
    const [step, setStep] = useState(1);
    
    // Tracks submission loading state to disable buttons and inputs during network requests
    const [loading, setLoading] = useState(false);
    
    // Toggles visibility of the password characters in the input field
    const [showPassword, setShowPassword] = useState(false);

    // Form inputs state values
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    /**
     * Step 1: Submits user email to request verification OTP.
     * Triggers backend email delivery and advances state to Step 2.
     * @param {Event} e - Form submission event
     */
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setLoading(true);
        try {
            // Trigger OTP request call to API
            await requestPasswordResetOTP({ email });
            toast.success("OTP sent to your email!");
            setStep(2); // Transition screen to OTP input form
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Step 2: Validates OTP and updates account password.
     * Submits payload and redirects to Login page on success.
     * @param {Event} e - Form submission event
     */
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) return toast.error("Please fill all fields");
        if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

        setLoading(true);
        try {
            // Submit verification code and new password credentials
            await resetPassword({ email, otp, newPassword });
            toast.success("Password reset successfully!");
            // Short delay to allow user to see success toast before redirect
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP or failed to reset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Page background glowing visual graphics */}
            <div className="login-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            {/* Centered card structure layout */}
            <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="forgot-password-card" style={{
                    background: 'rgba(26, 26, 46, 0.65)',
                    backdropFilter: 'blur(24px)',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    width: '100%',
                    maxWidth: '450px',
                    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)'
                }}>
                    {/* Hot Toast popup alerts container */}
                    <Toaster position="top-center" />

                    <div className="login-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <Link to="/" className="login-logo" style={{ display: 'block', marginBottom: '16px' }}>Cravora</Link>
                        <h2>{step === 1 ? "Reset Password" : "Create New Password"}</h2>
                        <p>{step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP sent to your email"}</p>
                    </div>

                    {/* Step 1 Form Layout: Input Email Address */}
                    {step === 1 ? (
                        <form onSubmit={handleRequestOTP} className="login-form">
                            <FormInput
                                label="Email Application"
                                icon={Mail}
                            >
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </FormInput>

                            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: '24px' }}>
                                {loading ? "Sending..." : "Send OTP"} <Send size={18} style={{ marginLeft: '8px' }} />
                            </button>
                        </form>
                    ) : (
                        // Step 2 Form Layout: Input OTP Code and New Password
                        <form onSubmit={handleResetPassword} className="login-form">
                            <FormInput
                                label="Enter OTP"
                                icon={KeyRound}
                            >
                                <input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={loading}
                                    maxLength={6}
                                    style={{ letterSpacing: '4px', fontWeight: '600' }}
                                />
                            </FormInput>

                            <FormInput
                                label="New Password"
                                icon={Lock}
                            >
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New strong password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                    style={{ paddingRight: '46px' }}
                                />
                                {/* Clickable eye icon overlay to toggle password character visibility */}
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </FormInput>

                            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: '24px' }}>
                                {loading ? "Reseting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <div className="login-footer" style={{ marginTop: '32px', textAlign: 'center' }}>
                        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    );
}
