import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import "./Register.css";

export default function Register() {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "Student",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error for this field on change
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errs.email = "Enter a valid email";
        if (!form.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
        else if (!/^[0-9]{10}$/.test(form.phoneNumber))
            errs.phoneNumber = "Enter a valid 10-digit number";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6)
            errs.password = "Minimum 6 characters";
        if (!form.confirmPassword) errs.confirmPassword = "Confirm your password";
        else if (form.password !== form.confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            const { confirmPassword, ...payload } = form;
            await register(payload);
            toast.success("Account created successfully!");
            setTimeout(() => navigate("/"), 1200);
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <div className="register-page">
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: "var(--bg-card)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                    },
                }}
            />

            {/* Animated background */}
            <div className="register-bg">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>
            <div className="register-grid"></div>

            {/* Registration Card */}
            <div className="register-card">
                <div className="register-header">
                    <div className="register-logo">Cravora</div>
                    <h2>Create your account</h2>
                    <p>Join the campus food revolution</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit} noValidate>
                    {/* Name */}
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                        </div>
                        {errors.name && <span className="field-error">⚠ {errors.name}</span>}
                    </div>

                    {/* Email & Phone side by side */}
                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <span className="input-icon">✉️</span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="phoneNumber">Phone</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📱</span>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="9876543210"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                />
                            </div>
                            {errors.phoneNumber && (
                                <span className="field-error">⚠ {errors.phoneNumber}</span>
                            )}
                        </div>
                    </div>

                    {/* Password & Confirm */}
                    <div className="input-row">
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="field-error">⚠ {errors.password}</span>
                            )}
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Re-enter password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? "🙈" : "👁️"}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="field-error">⚠ {errors.confirmPassword}</span>
                            )}
                        </div>
                    </div>

                    {/* Role selector */}
                    <div className="role-selector">
                        <label>I am a</label>
                        <div className="role-options">
                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="role-student"
                                    name="role"
                                    value="Student"
                                    checked={form.role === "Student"}
                                    onChange={handleChange}
                                />
                                <label htmlFor="role-student" className="role-label">
                                    <span className="role-emoji">🎓</span>
                                    <span className="role-name">Student</span>
                                </label>
                            </div>
                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="role-outlet"
                                    name="role"
                                    value="Outlet"
                                    checked={form.role === "Outlet"}
                                    onChange={handleChange}
                                />
                                <label htmlFor="role-outlet" className="role-label">
                                    <span className="role-emoji">🏪</span>
                                    <span className="role-name">Outlet</span>
                                </label>
                            </div>
                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="role-delivery"
                                    name="role"
                                    value="DeliveryPartner"
                                    checked={form.role === "DeliveryPartner"}
                                    onChange={handleChange}
                                />
                                <label htmlFor="role-delivery" className="role-label">
                                    <span className="role-emoji">🚴</span>
                                    <span className="role-name">Delivery</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="btn-spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            <>Create Account →</>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="register-divider">
                        <span>or</span>
                    </div>

                    {/* Footer */}
                    <div className="register-footer">
                        <p>
                            Already have an account?{" "}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
