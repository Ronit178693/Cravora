import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Mail, KeyRound, Lock, ArrowLeft, Send, Eye, EyeOff } from "lucide-react";
import FormInput from "../components/FormInput/FormInput.jsx";
import { requestPasswordResetOTP, resetPassword } from "../api/authApi";
import "./Login.css"; // Reuse login styles for consistency

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setLoading(true);
        try {
            await requestPasswordResetOTP({ email });
            toast.success("OTP sent to your email!");
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) return toast.error("Please fill all fields");
        if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

        setLoading(true);
        try {
            // Assuming backend expects { email, otp, newPassword }
            await resetPassword({ email, otp, newPassword });
            toast.success("Password reset successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP or failed to reset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Reuse background elements */}
            <div className="login-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

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
                    <Toaster position="top-center" />

                    <div className="login-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <Link to="/" className="login-logo" style={{ display: 'block', marginBottom: '16px' }}>Cravora</Link>
                        <h2>{step === 1 ? "Reset Password" : "Create New Password"}</h2>
                        <p>{step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP sent to your email"}</p>
                    </div>

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
