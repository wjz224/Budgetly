import classes from "../../css/LoginShared.module.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignUp from "./utils/GoogleSignUp";
import checkAuth from "./utils/checkAuth";
import { useAuth } from "./utils/AuthContext";
import { useCookies } from "react-cookie";

function Register() {
    const navigate = useNavigate();
    const { accessToken, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [messages, setMessages] = useState({ success: "", error: "" });

    useEffect(() => {
        const verifyAuth = async () => {
            if (!accessToken) {
                setIsLoading(false);
                return;
            }
            const isAuthenticated = await checkAuth(accessToken);
            if (isAuthenticated) {
                navigate("/dashboard");
            } else {
                setIsLoading(false);
            }
        };
        if (!loading) {
            verifyAuth();
        }
    }, [accessToken, loading, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setMessages({ error: "Passwords do not match.", success: "" });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessages({ success: data.message, error: "" });
            } else {
                setMessages({ error: data.detail || "Registration failed.", success: "" });
            }
        } catch (error) {
            setMessages({ error: "An error occurred. Please try again.", success: "" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <main>
                <section className={classes.section}>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <div className={classes["logo-container"]}>
                            <img src="/logo.png" alt="Logo" className={classes.logo} />
                        </div>

                        <h2 className={classes.div7}>Create your account</h2>
                        <GoogleSignUp className={classes.googleButton} />

                        <div className={classes.divider}>
                            <span>OR</span>
                        </div>

                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email address"
                                className={classes.input}
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Password"
                                className={classes.input}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                className={classes.input}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                        </div>

                        {messages.error && <p className="error">{messages.error}</p>}
                        {messages.success && <p className="success">{messages.success}</p>}

                        <div className={classes.buttons}>
                            <button type="submit" className={classes.button1}>
                                Sign Up
                            </button>
                            <Link to="/login" className={classes.button2}>
                                Already have an account? Login
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Register;

