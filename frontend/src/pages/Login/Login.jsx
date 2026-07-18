import "../../styles/Auth.css";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const submit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const data = new URLSearchParams();

            data.append("username", form.email);
            data.append("password", form.password);

            const res = await api.post(
                "/auth/login",
                data,
                {
                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                }
            );

            localStorage.setItem(
                "token",
                res.data.access_token
            );

            toast.success("Welcome Back!");

            navigate("/dashboard");

        } catch (err) {

            toast.error(
                err.response?.data?.detail ||
                "Login Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <span className="auth-badge">
                    AI Face Recognition
                </span>

                <h1>Welcome Back</h1>

                <p>
                    Sign in to manage your events, upload photos, and perform AI-powered face matching.
                </p>

                <form onSubmit={submit} className="auth-form">

                    <div className="form-group">
                        <label>Email Address</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {
                                    showPassword
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                }
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>

                </form>

                <p>

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;