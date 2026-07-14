import "../../styles/Auth.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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

                <h1>📸 Event Photo Face Matching</h1>

                <p>Welcome Back</p>

                <form onSubmit={submit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="primary-btn"
                    >

                        {
                            loading
                                ?
                                "Logging in..."
                                :
                                "Login"
                        }

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