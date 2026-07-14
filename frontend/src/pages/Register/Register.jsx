import "../../styles/Auth.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

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

                <h1>📸 Event Photo Face Matching</h1>

                <p>Create Your Account</p>

                <form onSubmit={submit}>

                    <input

                        type="text"

                        name="full_name"

                        placeholder="Full Name"

                        value={form.full_name}

                        onChange={handleChange}

                        required

                    />

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
                    >

                        {

                            loading

                                ?

                                "Creating Account..."

                                :

                                "Register"

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