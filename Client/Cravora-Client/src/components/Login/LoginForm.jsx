import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import FormInput from "../FormInput/FormInput";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
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
        if (!form.email.trim()) errs.email = "Email is required";
        if (!form.password) errs.password = "Password is required";
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
            await login(form);
            toast.success("Welcome back!");
            setTimeout(() => navigate("/dashboard"), 1000); // Redirect to dashboard or home
        } catch (err) {
            toast.error(err.message || "Invalid credentials");
        }
    };

    return (
        <div className="login-form-container">
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

            <div className="login-header">
                <Link to="/" className="login-logo">Cravora</Link>
                <h2>Welcome back</h2>
                <p>Enter your details to access your account</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <FormInput
                    label="Email Address"
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
                        disabled={loading}
                    />
                </FormInput>

                {/* Password */}
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <Lock className="input-icon" size={20} />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            disabled={loading}
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

                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="btn-spinner"></span>
                            Signing in...
                        </>
                    ) : (
                        <>Sign In →</>
                    )}
                </button>

                {/* Footer */}
                <div className="login-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">Create account</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
