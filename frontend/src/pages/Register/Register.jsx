import "../../styles/Auth.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({

        full_name: "",

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

            await api.post(

                "/auth/register",

                form

            );

            toast.success(

                "Registration Successful"

            );

            navigate("/");

        }

        catch (err) {

            toast.error(

                err.response?.data?.detail ||

                "Registration Failed"

            );

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <span className="auth-badge">
                    AI Face Recognition
                </span>

                <h1>Create Account</h1>

                <p>
                    Create your account to start managing events and AI-powered photo recognition.
                </p>

                <form onSubmit={submit} className="auth-form">

                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter your full name"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                                placeholder="Create a password"
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
                        {
                            loading
                                ? "Creating Account..."
                                : "Create Account"
                        }
                    </button>

                </form>

                <p>

                    Already have an account?

                    {" "}

                    <Link to="/">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;