import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    GraduationCap,
    Store,
    Bike
} from "lucide-react";
import FormInput from "../FormInput/FormInput";
// import "../pages/Register.css"; // Reuse ensuring styles apply or move relevant styles

export default function RegisterForm() {
    const navigate = useNavigate();
    const { register, loading, isCheckingSession } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "Student",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
            const res = await register(form);
            toast.success("Account created successfully!");
            if (res.user.role === "Outlet") {
                setTimeout(() => navigate("/outlet-dashboard"), 1200);
            }
            else if (res.user.role === "Student") {
                setTimeout(() => navigate("/student-dashboard"), 1200);
            }
            else {
                setTimeout(() => navigate("/"), 1200);
            }
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        }
    };

    return (
        <div className="register-form-container">
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

            <div className="register-header">
                <div className="register-logo">Cravora</div>
                <h2>Create your account</h2>
                <p>Join the campus food revolution</p>
            </div>

            <form className="register-form" onSubmit={handleSubmit} noValidate>
                {/* Name */}
                <FormInput
                    label="Full Name"
                    icon={User}
                    error={errors.name}
                >
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={handleChange}
                        autoComplete="name"
                    />
                </FormInput>

                {/* Email & Phone side by side */}
                <div className="input-row">
                    <FormInput
                        label="Email"
                        icon={Mail}
                        error={errors.email}
                    >
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </FormInput>

                    <FormInput
                        label="Phone"
                        icon={Phone}
                        error={errors.phoneNumber}
                    >
                        <input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="9876543210"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                    </FormInput>
                </div>

                {/* Password */}
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
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
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                    {errors.password && <span className="field-error">⚠ {errors.password}</span>}
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
                                <GraduationCap size={24} className="role-emoji" />
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
                                <Store size={24} className="role-emoji" />
                                <span className="role-name">Outlet</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="register-btn"
                    disabled={loading || isCheckingSession}
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
                        <Link to="/login">Login</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
