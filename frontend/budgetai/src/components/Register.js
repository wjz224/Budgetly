import "../css/Register.css";
import "../css/LoginShared.css"
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignUp from "./GoogleSignUp";
import checkAuth from "../utils/checkAuth"; // Import the checkAuth function
import {useAuth} from "./AuthContext"; // Import useAuth
import { useCookies } from "react-cookie";

function Register() {
    const navigate = useNavigate();
    const {accessToken, loading} = useAuth();
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [messages, setMessages] = useState({ success: "", error: "" });

    // Check authentication status on component mount
    useEffect(() => {
        const verifyAuth = async () => {
            if (!accessToken) {
                setIsLoading(false); // Stop loading if no access token
                return;
            }
            
            const isAuthenticated = await checkAuth(accessToken); // Call checkAuth with the access token
            if (isAuthenticated) {
                navigate("/dashboard"); // Redirect to main page if authenticated
            } else {
                setIsLoading(false); // Stop loading if not authenticated
            }
        };
        if (!loading){
            verifyAuth();
        }

    }, [accessToken, loading, navigate]); // Add accessToken to the dependency array

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading when the form is submitted

        if (formData.password !== formData.confirmPassword) {
            setMessages({ error: "Passwords do not match.", success: "" });
            setIsLoading(false); // Stop loading if validation fails
            return;
        }

        try {
            // Send registration data to the backend
            const response = await fetch("https://127.0.0.1:8000/register", {
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
            setIsLoading(false); // Stop loading after the request is complete
        }
    };

    // Show a loading spinner or placeholder while checking authentication or submitting the form
    if (isLoading) {
        return <div>Loading...</div>; // Replace with a spinner or loading animation if desired
    }

    return (
        <div className="BudgetAI">
            <main>
                <section className="section">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="logo-container">
                            <img src="/logo.png" alt="Logo" className="logo" />
                        </div>

                        <h2 className="div7">Create your account</h2>
                        <GoogleSignUp className="googleButton" />

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email address"
                                className="input"
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
                                className="input"
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
                                className="input"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                minLength="8"
                            />
                        </div>

                        {messages.error && <p className="error">{messages.error}</p>}
                        {messages.success && <p className="success">{messages.success}</p>}

                        <div className="buttons">
                            <button type="submit" className="button1">
                                Sign Up
                            </button>
                            <Link to="/login" className="button2">
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

